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
});