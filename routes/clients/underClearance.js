import express from "express";
import { adminOnly, clientProtect } from "../../middlewares/authMiddleware.js";
import { underClearanceReport } from "../../controllers/Clients/underClearanceReportController.js";

const underClearanceRouter = express.Router();

underClearanceRouter.get("/", clientProtect, adminOnly, underClearanceReport);

export default underClearanceRouter;
