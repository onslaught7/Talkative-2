import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
// The below hierarchy is to be maintained

// Loads the .env files and adds the files to the variable process.env
dotenv.config();

// Create an instance of an express application 
// along with the port to use for communication
const app = express();
const port = process.env.PORT || 3001;

// Retrive the dtabase connection URL from .env
const databaseURL = process.env.DATABASE_URL;

// Configuring the cors middleware and mounting it to our express application 
app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

// Serve static files from the "uploads/profiles" directory when the "/uploads/profiles" URL is accessed
app.use("/uploads/profiles", express.static("uploads/profiles"));

// Mounting the cookieParser middleware to our express appication
app.use(cookieParser());
// Integrating th express.json middleware to our express application
// parses incoming JSON payloads in the body of HTTP requests
// and makes them available under req.body
app.use(express.json());

// Call the authRoutes method to handle /api/auth route and 
// contactRoutes method to handle /api/contacts route
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Start express server and execute callback
const server = app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});

// Call setupSocket to enable WebSocket functionality
setupSocket(server);
 
// Establishing the conection to the database using url from .env
mongoose.connect(databaseURL).then(() => {
    console.log("mongoDB database connection successful");
}).catch((err) => {
    console.log(err.message);
});