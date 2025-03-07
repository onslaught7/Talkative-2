import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

// Function to set up WebSocket communication
const setupSocket = (server) => {

    // Create a new Socket.IO instance attached to the server
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Store active users and their socket connections
    const userSocketMap = new Map();

    // Function to handle user disconnection
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);

        // Loop through the userSocketMap to find and remove the disconnected user
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    
    const sendMessage = async (message) => {
        // Retirieve the sender's and recipient's websocket session IDs from the user-socket mapping
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        // Store the new message in the MongoDB database
        const createdMessage = await Message.create(message);
        
        // Retrieve the full message details, including sender and recipient information
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color") // Fetch sender's details
            .populate("recipient", "id email firstName lastName image color"); // Fetch recipient's details

        // Send the message to the recipient's socket if they are online
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }

        // Send the message to the sender's socket for UI update
        if (senderSocketId) { 
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    };

    // Handle new client connections
    io.on("connection", (socket) => {
        // Extract user ID from connection query
        const userId = socket.handshake.query.userId;

        if (userId) {
            // Store user ID and socket ID in the map
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        } else {
            console.log("User id not provided during connection.");
        }

        socket.on("sendMessage", sendMessage)
        // Handle client disconnection
        socket.on("disconnect", () => disconnect(socket)); 
    });
}

export default setupSocket;