import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
//import { getClients, getClientById, deleteClient } from "../controllers/clientController.js";

const clientRouter = express.Router();

//Client management routes
clientRouter.get("/", protect, adminOnly, getClients);
clientRouter.get("/:id", protect, getClientById);
clientRouter.delete("/:id", protect,  adminOnly, deleteClient);


export default userRouter;