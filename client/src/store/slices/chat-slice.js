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

    channels:[],
    setChannels: (channels) => set({channels}),

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

    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] });
    },
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
    },


    // Dynamically change the arrangement of channel based on the last message
    addChannelToChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        const index = channels.findIndex((channel) => channel._id === message.channelId);

        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    },

    addContactsToDMContacts: (message) => {
        const userId = get().userInfo.id;
        const fromId =
            message.sender._id === userId
                ? message.recipient._id
                : message.sender._id;
        const fromData =
            message.sender._id === userId ? message.recipient : message.sender;
        const dmContacts = get().directMessagesContacts;
        const data = dmContacts.find((contact) => contact._id === fromId);
        const index = dmContacts.findIndex((contact) => contact._id === fromId);
        console.log({ data, index, dmContacts, userId, message, fromData });
    
        if (index !== -1 && index !== undefined) {
            // console.log("in if condition");
            dmContacts.splice(index, 1);
            dmContacts.unshift(data);
        } else {
            // console.log("in else condition");
            dmContacts.unshift(fromData);
        }
    
        set({ directMessagesContacts: dmContacts });
    },  
});