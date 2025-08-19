import express from "express";
import { adminOnly, protect } from "../../middlewares/authMiddleware.js";
import { tobeLoadedReport } from "../../controllers/Clients/tobeLoadedReportController.js";

const tobeLoadedRouter = express.Router();

tobeLoadedRouter.get("/", protect, adminOnly, tobeLoadedReport);

export default tobeLoadedRouter;
