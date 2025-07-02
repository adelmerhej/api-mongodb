import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { totalProfitReport, jobStatusReport, emptyContainerReport, clientInvoiceReport, ongoingJobsReport } 
    from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/total-profits", protect, adminOnly, totalProfitReport);
reportRouter.get("/job-statuses", protect, adminOnly, jobStatusReport);
reportRouter.get("/empty-containers", protect, adminOnly, emptyContainerReport);
reportRouter.get("/client-invoices", protect, adminOnly, clientInvoiceReport);
reportRouter.get("/ongoing-jobs", protect, adminOnly, ongoingJobsReport);


export default reportRouter;