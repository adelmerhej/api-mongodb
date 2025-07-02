import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getUsers, getUserById, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

//User management routes
userRouter.get("/", protect, adminOnly, getUsers);
userRouter.get("/:id", protect, getUserById);
userRouter.delete("/:id", protect,  adminOnly, deleteUser);


export default userRouter;