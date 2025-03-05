import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const {searchTerm} = request.body;

        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("searchterm is required");
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g, // Regex to match special regex characters
            "\\$&" // Prefix each special character with a backslash to replace it
        );

        const regex = new RegExp(sanitizedSearchTerm, "i"); // case-insensitive regex

        const contacts = await User.find({
            $and: [ // $and ensures both conditions must be met
                {   _id: { $ne: request.userId }}, // Exclude the current user
                {
                    // Matches either firstName, lastName, or email against the regex
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] 
                 },
            ],
        });

        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}


export const getContactsForDMList = async (request, response, next) => {
    try {
        let { userId } = request; // Extract userId from request
        userId = new mongoose.Types.ObjectId(userId); // Convert to MongoDB ObjectId

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }], // Find messages where user is sender or recipient
                },
            },
            {
                $sort: { timestamp: -1 }, // Sort by latest messages first
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] }, // Determine the other user
                            then: "$recipient",
                            else: "$sender",
                        },   
                    },
                    lastMessageTime: { $first: "$timestamp" }, // Store the most recent message time
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo", // Fetch user details
                },
            },
            {
                // $project: {
                //     _id: 1,
                //     lastMessageTime: 1,
                //     email: "$contactInfo.email",
                //     firstName: "$contactInfo.firstName",
                //     lastName: "$contactInfo.lastName",
                //     image: "$contactInfo.image",
                //     color: "$contactInfo.color",
                // },
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: { $arrayElemAt: ["$contactInfo.email", 0] },
                    firstName: { $arrayElemAt: ["$contactInfo.firstName", 0] },
                    lastName: { $arrayElemAt: ["$contactInfo.lastName", 0] },
                    image: { $arrayElemAt: ["$contactInfo.image", 0] },
                    color: { $arrayElemAt: ["$contactInfo.color", 0] },
                }
            },
            { 
                $sort: { lastMessageTime: -1 }, // Sort contacts by last interaction
            },
        ])

        // console.log("ContactsConteroller, contacts: ");
        // console.log(contacts)

        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const getAllContacts = async (request, response, next) => {
    try {
        // Fetch all users from the database, except the requesting user (request.userId)
        const users = await User.find(
            {_id: { $ne: request.userId }}, // Exclude the requesting user
            "firstName lastName _id" // Only fetch necessary fields
        
        );

        // Format the response by mapping users into a simpler structure
        const contacts = users.map((user) => ({
            label: `${user.firstName} ${user.lastName}`, // Create a display-friendly label
            value: user._id, // Use the user's unique ID as the value (useful for selection tracking)
        }));

        // Return the contacts as a JSON response
        return response.status(200).json({ contacts });
    } catch (error) {
        // Log the error and return a 500 status code if something goes wrong
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}