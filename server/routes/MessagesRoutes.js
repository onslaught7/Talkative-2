import { Router } from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getMessages, uploadFiles } from "../controllers/MessagesController.js"
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({ dest: "uploads/files" });

messagesRoutes.post("/get-messages", verifyToken, getMessages);

// Define a route to upload files
// - verifyToken: Ensures user is authenticated
// - upload.single("file"): Middleware to handle a single file named "file"
// - uploadFiles: Function to process the uploaded file
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFiles);
export default messagesRoutes;