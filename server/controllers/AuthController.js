import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import { renameSync, unlinkSync } from 'fs'; // synchronous file system method to rename files
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

dotenv.config();


const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, { expiresIn : maxAge });
}

// Handle signup
export const signup = async (request, response, next) => {
    try {
        // destructuring assignment
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).send("A valid combination of Email and Password is required");
        }

        const user = await User.create( {email, password} );
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return response.status(201).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            },
        })
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

// Handle login 
export const login = async (request, response, next) => {
    try {
        // destructuring assignment
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).send("A valid combination of Email and Password is required");
        }

        const user = await User.findOne( { email } );

        if (!user) {
            return response.status(404).send("User doesn't exist, trying signing up instead");
        }

        // Check the password saved in the database (user.password)
        // against the password typed in for login (password)
        const auth = await compare(password, user.password);

        if (!auth) {
            return response.status(400).send("Email and Password combination is incorrect");
        } else {

        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return response.status(200).json({
            user:{
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
                profileSetup: user.profileSetup
            },
        })
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (request, response, next) => {
    try {
        // console.log(request.userId);
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with the given id not found");
        }
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup
        })
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;

        if (!firstName) {
            return response.status(400).send("First Name and color are required.");
        }
        
        const userData = await User.findByIdAndUpdate(
            userId, 
            {
                firstName, lastName, color, profileSetup:true
            },  
            { 
                new:true, runValidators:true 
            }
        );

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup
        })
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required.")
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        // Used to rename or move files synchronously
        // Rename the uploaded file from its temporary location to the desired folder with a unique name
        renameSync(request.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            request.userId,
            { image: fileName },
            { new: true, runValidators: true } // new: true Returns the updated document instead of the old one  
            // validate schema  
        );

        return response.status(200).json({
            image: updatedUser.image,
        });

    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).send("User not found.")
        }

        if (user.image) {
            // If the user has an image, delete the image file from the server's storage using `unlinkSync`
            // `unlinkSync` is a synchronous method from the `fs` (filesystem) module that deletes a file
            unlinkSync(user.image)
        }

        // Save the updated user document to the database after setting the image to null
        user.image = null;
        await user.save();

        return response.status(200).send("Profile image removed successfully.")
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const logout = async (request, response, next) => {
    try {
        // Clear the JWT cookie by setting it to an empty string and setting a maxAge of 1 millisecond (which expires it immediately)
        response.cookie(
            "jwt", 
            "",  
            { 
                maxAge: 1, // Set the cookie's expiration time to 1 millisecond, effectively expiring it immediately
                secure: true, // Ensure the cookie is only sent over HTTPS (i.e., secure cookies)
                sameSite: "None" // Allow the cookie to be sent across different sites (for cross-origin requests)
            }) ;
        return response.status(200).send("Logged out successfully.");
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

