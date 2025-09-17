import express from "express";
import { adminOnly, clientProtect } from "../../middlewares/authMiddleware.js";
import { tobeLoadedReport } from "../../controllers/Clients/tobeLoadedReportController.js";

const tobeLoadedRouter = express.Router();

tobeLoadedRouter.get("/", clientProtect, adminOnly, tobeLoadedReport);

export default tobeLoadedRouter;
