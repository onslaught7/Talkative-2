import { Server as SocketIOServer } from "socket.io";

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

        // Handle client disconnection
        socket.on("disconnect", () => disconnect(socket)); 
    });
}

export default setupSocket;