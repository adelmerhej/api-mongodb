import express from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
  updateUserInfo,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { verify2FA, generate2FASecret } from "../controllers/twoFactorAuthController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/profile", protect, getUserInfo);
authRoutes.put("/profile", protect, updateUserInfo);
authRoutes.post("/verify-2fa", verify2FA);
authRoutes.post("/generate-2fa-secret", generate2FASecret);

authRoutes.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file){
        return res.status(400).json({ message: "No file uploaded"})
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl })
})

export default authRoutes;
