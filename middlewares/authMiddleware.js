import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token failed", error: err.message });
  }
};

// New middleware to protect client routes using sessionToken instead of JWT
export const clientProtect = (req, res, next) => {
  try {
    // Accept session token from common locations
    const token =
      req.headers["x-session-token"] ||
      req.headers["sessiontoken"] ||
      req.headers["session-token"] ||
      req.query.sessionToken ||
      (req.body && req.body.sessionToken);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no session token" });
    }

    // Validate against configured allowlist of tokens (comma-separated)
    const tokensList = (process.env.CLIENT_SESSION_TOKENS || process.env.CLIENT_SESSION_TOKEN || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (tokensList.length === 0) {
      return res.status(500).json({ message: "Server misconfigured: no client session tokens configured" });
    }

    if (!tokensList.includes(token)) {
      return res.status(401).json({ message: "Invalid session token" });
    }

    // Attach limited client session context and continue
    req.clientSession = { token };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Session token validation failed", error: err.message });
  }
};

//Middleware for role-based access control
export const adminOnly = (req, res, next) => {
  const allowedRoles = ['admin', 'user', 'customer'];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, authorized users only" });
  }
};
