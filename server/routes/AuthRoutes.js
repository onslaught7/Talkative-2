import { Router } from 'express'
import { signup } from '../controllers/AuthController.js'

// Creating a new instance of a router
const authRoutes = Router();

// When someone tries to send info through the /signup route
// it is handled in the signup function
authRoutes.post("/signup", signup);

export default authRoutes;
