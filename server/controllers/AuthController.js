import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { compare } from 'bcrypt'

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
        console.log(request.userId);
        // return response.status(200).json({
        //     user:{
        //         id: user.id,
        //         email: user.email,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         image: user.image,
        //         color: user.color,
        //         profileSetup: user.profileSetup
        //     },
        // })
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}