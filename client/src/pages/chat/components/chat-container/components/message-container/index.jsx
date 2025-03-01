import { useAppStore } from "@/store";
import moment from 'moment';
import { useEffect, useRef, useState } from "react";
import { apiClient } from '@/lib/api-client.js'
import { HOST, GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from 'react-icons/io5'
import { motion, progress } from "framer-motion";

const MessageContainer = () => {
  // Create a ref to track the last message for auto-scrolling
  const scrollRef = useRef();

  // Extract necessary states and actions from the global zustand store
  const { 
    selectedChatType, 
    selectedChatData, 
    userInfo, 
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  // Fetch messages when the selected chat changes
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id }, // Send selected chat ID in request body
          { withCredentials: true }, // Include authentication cookies
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages); // Store messages in state
        }
      } catch (error) {
        console.log({ error }); // Log errors for debugging
      }
    }

    if (selectedChatData._id) { // Ensure a chat is selected
      // Fetch messages for direct messages (DMs)
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]); // Re-run when changes

  // Scroll to the last message when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      // Smooth scrolling to the last message
      // scroll into view is a built-in method available on dom elements
      scrollRef.current.scrollIntoView({ behavior: "smooth" }); // smooth enables smooth scrolling instead of instant jumps
    }
  }, [selectedChatMessages]);

  // Returns true if the filePath matches the regex
  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tif|tiff|webp|svg|ico|heic|heif)$/i; // Case-insensitive match
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(
      `${HOST}/${url}`,
      { 
        responseType: "blob", 
        onDownloadProgress: (progressEvent) => {
          const { loaded, total} = progressEvent;
          const percentCompleted = Math.round((loaded * 100)/total);
          setFileDownloadProgress(percentCompleted);
        }
      }
    );

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderMessages = () => {
    let lastDate = null; // Track the last message date to show date separators
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate; // Show date separator if date changes
      lastDate = messageDate; // Update lastDate for the next iteration

      return (
        <div key={index}>
          {
            showDate && ( // Display date separator if it's a new date
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderDMMessages(message)
          }
        </div>
      )
    });
  }

  // Render single direct message
  const renderDMMessages = (message) => {
    return (
      <div 
      className={`${
        message.sender === selectedChatData._id 
        ? "text-left" 
        : "text-right"}`
        }>
        {
          message.messageType === "text" && (
            <div 
              className={
              `${message.sender !== selectedChatData._id 
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"}
              border inline-block p-4 rounded my-1 max-w-[50%] break-words`
              }>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div 
                className={
                `${message.sender !== selectedChatData._id 
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"}
                border inline-block p-4 rounded my-1 max-w-[50%] break-words`
                }>
                {
                  checkIfImage(message.fileUrl)
                  ? <div className="cursor-pointer"
                    onClick={() => {
                      setShowImage(true);
                      setImageURL(message.fileUrl);
                    }}
                  >
                    <img 
                      src={`${HOST}/${message.fileUrl}`}
                      height={300}
                      width={300}
                    />
                  </div>
                  : <div className="flex items-center justify-center gap-4">
                    <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split('/').pop()}</span>
                    <span 
                      className="bg-black/20 p-3 text-2xl rounded-full 
                      hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() => downloadFile(message.fileUrl)}
                    >
                      <IoMdArrowRoundDown />
                    </span>
                  </div>
                }
            </div>
          )
        }
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()} 
      <div ref={scrollRef}>
        {showImage && (
          <div 
            className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex 
            items-center justify-center backdrop-blur-lg flex-col"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <img
                src={`${HOST}/${imageURL}`}
                className="h-[80vh] w-full bg-cover"
              />
            </motion.div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button className="bg-black/20 p-3 text-2xl rounded-full 
              hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
              >
                <IoMdArrowRoundDown/>
              </button>
              <button className="bg-black/20 p-3 text-2xl rounded-full 
              hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
              >
                <IoCloseSharp/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageContainer