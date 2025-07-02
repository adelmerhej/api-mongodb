import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskCheckList,
  updateTaskStatus,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

//Task management routes
taskRouter.get("/dashboard-data", protect, getDashboardData);
taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);
taskRouter.get("/", protect, getTasks);
taskRouter.get("/:id", protect, getTaskById);
taskRouter.post("/", protect, adminOnly, createTask);
taskRouter.put("/:id", protect, updateTask);
taskRouter.delete("/:id", protect, adminOnly, deleteTask);
taskRouter.put("/:id/status", protect, updateTaskStatus);
taskRouter.put("/:id/todo", protect, updateTaskCheckList);

export default taskRouter;
