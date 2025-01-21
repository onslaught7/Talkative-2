import { Router } from 'express'
import { signup, login, getUserInfo, updateProfile, addProfileImage } from '../controllers/AuthController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';

// Creating a new instance of a router
const authRoutes = Router();

// When someone tries to send info through the /signup route
// it is handled in the signup function
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
// verifyToken is the middleware
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, addProfileImage);

export default authRoutes;
