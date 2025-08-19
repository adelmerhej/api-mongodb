import express from "express";
import { adminOnly, protect } from "../../middlewares/authMiddleware.js";
import { invoiceStatusReport } from "../../controllers/Clients/invoiceStatusReportController.js";

const invoiceStatusRouter = express.Router();

invoiceStatusRouter.get("/", protect, adminOnly, invoiceStatusReport);

export default invoiceStatusRouter;
