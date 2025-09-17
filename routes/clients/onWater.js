import express from "express";
import { adminOnly, clientProtect } from "../../middlewares/authMiddleware.js";
import { onWaterReport } from "../../controllers/Clients/onWaterReportController.js";

const onWaterRouter = express.Router();

onWaterRouter.get("/", clientProtect, adminOnly, onWaterReport);

export default onWaterRouter;
