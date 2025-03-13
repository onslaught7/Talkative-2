import { createContext, useContext, useEffect, useRef } from "react"
import { useAppStore } from "@/store/index.js"
import { HOST } from "@/utils/constants.js"
import { io } from "socket.io-client"

// Create WebSocket context
const SocketContext = createContext(null);

// Custom hook for easy access to socket
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(); // Store the socket instance, so it doesn't reset on re-renders
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            // Establish socket connection
            socket.current = io(HOST, {
                withCredentials: true, // Include authentication cookies
                query: { userId: userInfo.id }, // Send user ID to server
            });
            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleRecieveMessage = (message) => {
                // getState() allows you to access the store's current state outside of a React component or hook
                // Unlike useAppStore(), which is a React hook and must be used within a component or hook function
                const { selectedChatData, selectedChatType, addMessage, addContactsToDMContacts } = useAppStore.getState();

                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log("message recieved", message);
                    addMessage(message);
                }

                addContactsToDMContacts(message);
            }

            const handleRecieveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelToChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }

                addChannelToChannelList(message);
            }

            socket.current.on("receiveMessage", handleRecieveMessage);
            socket.current.on("receive-channel-message", handleRecieveChannelMessage);

            return () => {
                socket.current.disconnect(); // Cleanup on unmount
            };
        }
    }, [userInfo]); // Re-run effect when userInfo changes

    return (
        <SocketContext.Provider value = {socket.current}>
            {children}
        </SocketContext.Provider>
    )
}

