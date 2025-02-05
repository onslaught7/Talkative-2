import { Router } from 'express'
import { signup, login, getUserInfo, updateProfile, addProfileImage, removeProfileImage, logout } from '../controllers/AuthController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';

// Creating a new instance of a router
const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/"});

// When someone tries to send info through the /signup route
// it is handled in the signup function
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
// verifyToken is the middleware
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

export default authRoutes;
