export const createChatSlice = (set,get) => ({
    // Stores the type of the selected chat (e.g., "channel", "direct message")
    selectedChatType: undefined,

    // Stores details about the selected chat (e.g., chat ID, participants, chat name)
    selectedChatData: undefined,

    selectedChatMessages: [],

    // Functions to update the states
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

    // Function to reset the chat state (e.g., when the chat is closed)
    closeChat: () => set(
        {
            selectedChatData: undefined, 
            selectedChatType: undefined,
            selectedChatMessages: [],
        }
    ),

    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages; // Get the current chat messages from the store
        const selectedChatType = get().selectedChatType; // Get the type of chat (channel or direct chat)

        set({
            selectedChatMessages:[ // Ensure correct spelling; this updates the state
                ...selectedChatMessages, { // Keep all existing messages
                    ...message, // Copy all properties of the incoming message

                    // If the chat is a channel, keep recipient as is. 
                    // Otherwise, store only the recipient's ID.
                    recipient: 
                        selectedChatType === "channel" 
                            ? message.recipient 
                            : message.recipient._id,

                    // If the chat is a channel, keep sender as is.
                    // Otherwise, store only the sender's ID.
                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id,
                }
            ]
        })
    }
});