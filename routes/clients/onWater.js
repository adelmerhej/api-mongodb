import express from "express";
import { clientAccess, clientProtect } from "../../middlewares/authMiddleware.js";
import { onWaterReport } from "../../controllers/Clients/onWaterReportController.js";

const onWaterRouter = express.Router();

onWaterRouter.get("/", clientProtect, clientAccess, onWaterReport);

export default onWaterRouter;
