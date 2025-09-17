import express from "express";
import { adminOnly, clientProtect } from "../../middlewares/authMiddleware.js";
import { invoiceStatusReport } from "../../controllers/Clients/InvoiceStatusReportController.js";

const invoiceStatusRouter = express.Router();

invoiceStatusRouter.get("/", clientProtect, adminOnly, invoiceStatusReport);

export default invoiceStatusRouter;
