import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { exportTasksReport, exportUsersReport } from "../controllers/reportController.js";

const reportRouter = express.Router();


reportRouter.get("/export/tasks", protect, adminOnly, exportTasksReport);
reportRouter.get("/export/users", protect, adminOnly, exportUsersReport);


export default reportRouter;