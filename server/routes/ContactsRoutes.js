import { Router } from "express";
import { searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);

export default contactRoutes;