import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { 
    totalProfitReport, syncTotalProfitReport, 
    jobStatusReport, 
    emptyContainerReport, 
    clientInvoiceReport,
    clientInvoiceDetailReport, 
    ongoingJobsReport } 
    from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/total-profits", protect, adminOnly, totalProfitReport);
reportRouter.post("/sync-total-profits", syncTotalProfitReport);

reportRouter.get("/job-status", protect, adminOnly, jobStatusReport);
reportRouter.get("/empty-containers", protect, adminOnly, emptyContainerReport);
reportRouter.get("/client-invoices", protect, adminOnly, clientInvoiceReport);
reportRouter.get("/client-invoice-details", protect, adminOnly, clientInvoiceDetailReport);
reportRouter.get("/ongoing-jobs", protect, adminOnly, ongoingJobsReport);


export default reportRouter;