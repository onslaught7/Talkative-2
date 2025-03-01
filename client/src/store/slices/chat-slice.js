export const createChatSlice = (set,get) => ({
    // Stores the type of the selected chat (e.g., "channel", "direct message")
    selectedChatType: undefined,

    // Stores details about the selected chat (e.g., chat ID, participants, chat name)
    selectedChatData: undefined,

    selectedChatMessages: [],
    directMessagesContacts: [],

    isUploading: false, // Boolean flag indicating whether a file is currently being uploaded
    isDownloading: false, // Boolean flag indicating whether a file is currently being downloaded
    fileUploadProgress: 0, // Upload progress percentage (0 - 100)
    fileDownloadProgress: 0, // Download progress percentage (0 - 100)

    setIsUploading: (isUploading) => set({ isUploading }), 
    // Function to update the `isUploading` state

    setIsDownloading: (isDownloading) => set({ isDownloading }), 
    // Function to update the `isDownloading` state

    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }), 
    // Function to update the `fileUploadProgress` state (e.g., 0% → 100%)

    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    // Function to update the `fileDownloadProgress` state (e.g., 0% → 100%)
     
    // Functions to update the states
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),

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