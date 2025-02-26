import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from 'fs';

// Controller function to fetch messages between two users
export const getMessages = async (request, response, next) => {
    try {
        // console.log(request);

        // Extract user IDs from the request      
        const user1 = request.userId;
        const user2 = request.body.id;

        // Validate if both user IDs are provided
        if (!user1 || !user2) {
            return response.status(400).send("Both user ID's are required");
        }

        // Query messages where either user is the sender or recipient
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 }); // Sorting the mesages to be displayed in ascending order of timestamps

        // return the messages as a JSON response
        return response.status(200).json({ messages });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

// Controller function to handle file uploads
export const uploadFiles = async (request, response, next) => {
    try {
        // Check if a file was uploaded
        if (!request.file) {
            return response.status(400).send("File is required"); // Return error if no file found
        }
        
        // Generate a unique timestamp-based directory for the uploaded file
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${request.file.originalname}`;

        // Create directory if it does not exist
        mkdirSync(fileDir, { recursive: true });
        // Move file from temporary location to the desired location
        renameSync(request.file.path, fileName);

        // Send success response with file path
        return response.status(200).json({ filePath: fileName });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}