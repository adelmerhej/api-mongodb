import express from "express";
import { clientAccess, clientProtect } from "../../middlewares/authMiddleware.js";
import { underClearanceReport } from "../../controllers/Clients/underClearanceReportController.js";

const underClearanceRouter = express.Router();

underClearanceRouter.get("/", clientProtect, clientAccess, underClearanceReport);

export default underClearanceRouter;
