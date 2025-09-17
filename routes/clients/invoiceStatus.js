import express from "express";
import { clientAccess, clientProtect } from "../../middlewares/authMiddleware.js";
import { invoiceStatusReport } from "../../controllers/Clients/InvoiceStatusReportController.js";

const invoiceStatusRouter = express.Router();

invoiceStatusRouter.get("/", clientProtect, clientAccess, invoiceStatusReport);

export default invoiceStatusRouter;
