import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { 
    totalProfitReport, 
    jobStatusReport, 
    emptyContainerReport, 
    invoiceClientReport,
    invoiceDetailClientReport,
    ongoingJobsReport } 
    from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/total-profits", protect, adminOnly, totalProfitReport);

reportRouter.get("/job-status", protect, adminOnly, jobStatusReport);
reportRouter.get("/empty-containers", protect, adminOnly, emptyContainerReport);
reportRouter.get("/client-invoices", protect, adminOnly, invoiceClientReport);
reportRouter.get("/client-invoices-detailed", protect, adminOnly, invoiceDetailClientReport);
reportRouter.get("/ongoing-jobs", protect, adminOnly, ongoingJobsReport);


export default reportRouter;