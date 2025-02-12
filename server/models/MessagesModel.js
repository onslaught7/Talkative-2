import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    // Sender of the message - references the "Users" collection
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    // Recipient of the message - references the "Users" collection
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },

    // Type of message (can be either "text" or "file")
    messageType: {
        type: String,
        enum: ['text', 'file'],
        required: true,
    },

    // Message content - required only if messageType is "text"
    content: {
        type: String,
        required: function() {
            return this.messageType === "text";
        },
    },

    // File URL - required only if messageType is "file"
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
    },

    
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;