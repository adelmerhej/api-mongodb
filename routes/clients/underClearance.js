import express from "express";
import { adminOnly, protect } from "../../middlewares/authMiddleware.js";
import { underClearanceReport } from "../../controllers/Clients/underClearanceReportController.js";

const underClearanceRouter = express.Router();

underClearanceRouter.get("/", protect, adminOnly, underClearanceReport);

export default underClearanceRouter;
