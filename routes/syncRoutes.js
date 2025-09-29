import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { syncClientInvocies } 
    from "../controllers/admin/reports/syncClientInvocies.js";
import { syncEmptyContainers } 
    from "../controllers/admin/reports/syncEmptyContainers.js";
import { syncJobStatus } 
    from "../controllers/admin/reports/syncJobStatus.js";
import { syncOngoingJobs } 
    from "../controllers/admin/reports/syncOngoingJobs.js";
import { syncTotalProfit } 
    from "../controllers/admin/reports/syncTotalProfit.js";
import { syncTobeLoadedJobs } 
    from "../controllers/Clients/sync/syncTobeLoaded.js";
const syncRouter = express.Router();

syncRouter.post("/sync-client-invoices", protect, adminOnly, syncClientInvocies);
syncRouter.post("/sync-empty-containers", protect, adminOnly, syncEmptyContainers);
syncRouter.post("/sync-job-status", protect, adminOnly, syncJobStatus);
syncRouter.post("/sync-ongoing-jobs", protect, adminOnly, syncOngoingJobs);
syncRouter.post("/sync-total-profit", protect, adminOnly, syncTotalProfit);

//client routes
syncRouter.post("/client/sync-be-loaded", protect, adminOnly, syncTobeLoadedJobs);


export default syncRouter;