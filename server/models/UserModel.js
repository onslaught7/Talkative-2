import mongoose from 'mongoose'
import { genSalt, hash } from 'bcrypt'

// Defining the schema for our users 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
});

// this keyword doesn't work with arrow function
// A pre-save hook in moongose that runs before saving a document to a database
userSchema.pre("save", async function (next) {
    const salt = await genSalt();
    // Refers to the key in the mongoDB database
    this.password = await hash(this.password, salt);
    next(); // calls the next middleware or saves the function
});

// The User model provides an interface to interact with the 
// "users" collection in the MongoDB database
const User = mongoose.model("Users", userSchema);

export default User;