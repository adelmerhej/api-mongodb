import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from'compression';
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import tobeLoadedRouter from "./routes/clients/tobeLoaded.js";
import onWaterRouter from "./routes/clients/onWater.js";
import underClearanceRouter from "./routes/clients/underClearance.js";
import invoiceStatusRouter from "./routes/clients/invoiceStatus.js";
import syncRouter from "./routes/syncRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Session"],
  })
);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

//Middleware
app.use(express.json());

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/admin/reports", reportRouter);
app.use("/api/v1/clients/to-be-loaded", tobeLoadedRouter);
app.use("/api/v1/clients/on-water", onWaterRouter);
app.use("/api/v1/clients/under-clearance", underClearanceRouter);
app.use("/api/v1/clients/invoice-status", invoiceStatusRouter);


//Sync Routes
app.use("/api/v1/sync", syncRouter);


//Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;
