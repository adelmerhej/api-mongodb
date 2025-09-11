import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import { token } from "morgan";

//Generate JWT token
const generateToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "7h",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  //console.log("Token: ", accessToken);
  
  return { accessToken, refreshToken };
};

//Register user
export const registerUser = async (req, res) => {
  const { username, email, password, fullName, profilePicture, adminInvitetoken,
    twoFactorEnabled, twoFactorSecret, resetToken, resetTokenExpiry, 
    loginAttempts, lockoutExpiry
   } =
    req.body;

  //Validation: check for missing fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email or password are required." });
  }

  try {
    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    let role = "customer";
    //Check if admin invite token is valid
    //If yes, set role to admin
    //If no, set role to user
    //If no token is provided, set role to user
    if (
      adminInvitetoken &&
      adminInvitetoken != process.env.ADMIN_INVITE_TOKEN
    ) {
      return res.status(400).json({ message: "Invalid admin invite token." });
    }
    //If token is provided and valid, set role to admin
    if (
      adminInvitetoken &&
      adminInvitetoken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    //Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      profilePicture,
      twoFactorEnabled,
      twoFactorSecret,
      resetToken,
      resetTokenExpiry,
      role,
      loginAttempts,
      lockoutExpiry,
      userId: 0,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
      role: user.role,
      userId: user.userId,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while creating new user", error: err.message });
  }
};

//Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("Login attempt - Email:", email);
    //console.log("Login attempt - Password:", password);
    
    const user = await User.findOne({ email });
    //console.log('User found: ', user ? 'Yes' : 'No');
    
    // 1. Check if user exists
    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "User does not exist or invalid password." });
    }
    //console.log('User details: ', user);

    // 2. Verify email and password
    //console.log("Provided password:", password);
    //console.log("Stored hashed password:", user.password);
    
    // Try password comparison with explicit error handling
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      //console.log("Password comparison result:", isMatch);
    } catch (error) {
      console.error("Error during password comparison:", error);
      return res.status(500).json({ message: "Error verifying password", error: error.message });
    }
    
    if (!isMatch) {
      console.log("Login failed: Password mismatch");
      return res.status(401).json({ message: "Invalid email or password." });
    }
    //console.log("Password verification successful");

    // 3. Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return temp token (valid for 5 minutes) requiring 2FA
      const tempToken = jwt.sign(
        { id: user._id, requires2FA: true },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "5m" }
      );
      return res.status(200).json({ requires2FA: true, tempToken });
    }

    // 4. If no 2FA, return normal tokens
    const { accessToken, refreshToken } = generateToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    //Return user data with jwt
    res.json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while login, contact your system administrator.",
      error: err.message,
    });
  }
};

export const verify2FA = async (req, res) => {
  const { token, tempToken } = req.body;

  try {
    // 1. Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_ACCESS_SECRET);
    if (!decoded.requires2FA) throw new Error("Invalid token");

    // 2. Get user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    // 3. Verify 2FA code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) return res.status(401).json({ error: "Invalid 2FA code" });

    // 4. Return final tokens
    const { accessToken, refreshToken } = generateToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: "2FA verification failed" });
  }
};

//Get user info
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while getting info.", error: err.message });
  }
};

//Update user info
export const updateUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401).json({ message: "User not found." });
    }

    user.username = req.body.username || user.username;
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      userName: updateUser.username,
      fullName: updateUser.fullName,
      email: updateUser.email,
      role: updateUser.role,
      token: generateToken(updateUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: "server error.", error: err.message });
  }
};
