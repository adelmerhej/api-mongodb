import express from "express";
import { clientAccess, clientProtect } from "../../middlewares/authMiddleware.js";
import { tobeLoadedReport } from "../../controllers/Clients/tobeLoadedReportController.js";

const tobeLoadedRouter = express.Router();

tobeLoadedRouter.get("/", clientProtect, clientAccess, tobeLoadedReport);

export default tobeLoadedRouter;