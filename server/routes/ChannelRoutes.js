import { Router } from "express";
import { createChannel, addAdmin, removeAdmin } from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.put("/add-admin", verifyToken, addAdmin);
channelRoutes.put("/remove-admin", verifyToken, removeAdmin);

export default channelRoutes;