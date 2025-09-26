import express from "express";
import { protect, adminOnly } from "../../middlewares/authMiddleware.js";
import { onWaterSqlReport } from "../../controllers/Clients/onWaterSqlReportController.js";

const onWaterRouter = express.Router();

onWaterRouter.get("/", protect, adminOnly, onWaterSqlReport);

export default onWaterRouter;
