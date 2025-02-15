import Message from "../models/MessagesModel.js";

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