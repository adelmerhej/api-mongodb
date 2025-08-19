import express from "express";
import { adminOnly, protect } from "../../middlewares/authMiddleware.js";
import { onWaterReport } from "../../controllers/Clients/onWaterReportController.js";

const onWaterRouter = express.Router();

onWaterRouter.get("/", protect, adminOnly, onWaterReport);

export default onWaterRouter;
