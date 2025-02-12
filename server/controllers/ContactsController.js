import User from "../models/UserModel.js";

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

