import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (request, response, next) => {
    try {
        const { name, members } = request.body; // Accept multiple admins
        const userId = request.userId;

        const admin = await User.findById(userId);

        // Ensure all provided admins are also valid members
        if (!admin) {
            return response.status(400).send("Admins must be members of the channel.");
        }

        const validMembers = await User.find({_id: { $in: members }})

        if (validMembers.length !== members.length) {
            return response.status(400).send("Some members are not valid users");
        }
        const newChannel = new Channel({
            name, 
            members,
            admin: userId, // Default to creator as admin if none are provided
        });

        await newChannel.save();
        return response.status(201).json({ channel: newChannel });

    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};


export const getUserChannels = async (request, response, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(request.userId);
        const channels = await Channel.find({
            $or : [{ admin: userId}, { members: userId }],
        }).sort({ updatedAt: -1 });

        return response.status(201).json({ channels });
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getChannelMessages = async (request, response, next) => {
    try {
        // Extract the channelId from the request parameters
        const { channelId } = request.params;

        // Find the channel by its ID and populate the messages
        // The 'populate' method is used to fetch the sender details for each message
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color", 
            }
        });

        // If the channel is not found, return a 404 status with an error message
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Extract the messages from the channel
        const messages = channel.messages;

        // Return the messages with a 201 status code
        return response.status(201).json({ messages });
    } catch (error) {
        // Log any errors and return a 500 status code with an error message
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

// export const addAdmin = async (request, response) => {
//     try {
//         const { channelId, newAdminId } = request.body;
//         const userId = request.userId;

//         const channel = await Channel.findById(channelId).lean(); // `lean()` returns a plain object
//         if (!channel) {
//             return response.status(404).send("Channel not found");
//         }

//         if (!channel.admins.includes(userId)) {
//             return response.status(403).send("Only admins can add new admins");
//         }

//         if (!channel.members.includes(newAdminId)) {
//             return response.status(400).send("New admin must be a member of the channel");
//         }

//         if (!channel.admins.includes(newAdminId)) {
//             await Channel.findByIdAndUpdate(channelId, { 
//                 $addToSet: { admins: newAdminId } // `$addToSet` prevents duplicates
//             });

//             return response.status(200).json({ message: "Admin added successfully" });
//         }

//         return response.status(400).send("User is already an admin");

//     } catch (error) {
//         console.error(error);
//         return response.status(500).send("Internal Server Error");
//     }
// };



// export const removeAdmin = async (request, response) => {
//     try {
//         const { channelId, adminIdToRemove } = request.body;
//         const userId = request.userId;

//         const channel = await Channel.findById(channelId).lean();
//         if (!channel) {
//             return response.status(404).send("Channel not found");
//         }

//         if (!channel.admins.includes(userId)) {
//             return response.status(403).send("Only admins can remove an admin");
//         }

//         if (channel.admins.length === 1) {
//             return response.status(400).send("A channel must have at least one admin");
//         }

//         await Channel.findByIdAndUpdate(channelId, {
//             $pull: { admins: adminIdToRemove }
//         });

//         return response.status(200).json({ message: "Admin removed successfully" });

//     } catch (error) {
//         console.error(error);
//         return response.status(500).send("Internal Server Error");
//     }
// };

