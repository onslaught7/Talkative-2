import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useAppStore } from "@/store"
import { useSocket } from "@/context/SocketContext"
import { apiClient } from "@/lib/api-client.js"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"


const MessageBar = () => {
  const emojiRef = useRef();
  // Create a reference for the hidden file input
  const fileInputRef = useRef();
  const emojiButtonRef = useRef();
  const {
    selectedChatType, 
    selectedChatData, 
    userInfo, 
    setIsUploading, 
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      // Check if emojiRef exists and if the clicked area is outside the emoji picker
      if (emojiRef.current && !emojiRef.current.contains(event.target) &&
      emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    // Attach an event listener to detect clicks anywhere in the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });

      setMessage(""); // Clear input field after sending
    }
  }

  // Triggers the hidden file input when the button is clicked
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // Handles file selection and upload
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      // console.log({file})

      if (file) {
        const formData = new FormData();
        formData.append("file", file); // "file" key as of backend expectation (Multer)
        setIsUploading(true);
        const response = await apiClient.post(
          UPLOAD_FILE_ROUTE,
          formData, // The FormData object containing the file
          { 
            withCredentials: true, // Ensure authentication credentials are included
            // Built-in Axios request configuration object
            onUploadProgress: (data) => {
            // Monitor upload progress
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
            },
          }, 
          
        );

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath, // File path from server response
            });
          }
        }
      }

    } catch(error) {
      setIsUploading(false);
      console.log({ error });
    }
  }


  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input 
          type="text" 
          className="flex-1 p-5 bg-transparent rounded-md foocus:border-none focus:outline-none"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update state on user input
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl"/>
        </button>
        {/* Hidden file input */}
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange}/>
        <div className="relative">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={() => setEmojiPickerOpen(prev => !prev)}
            ref={emojiButtonRef}
          >
            <RiEmojiStickerLine className="text-2xl"/>
          </button>
          <div
        className={`absolute bottom-16 right-0 transition-transform duration-300 ease-in-out ${
            // Conditional classes based on the emojiPickerOpen state
            emojiPickerOpen 
            ? 'transform translate-y-0 opacity-100' // When open, use translate-y-0 and full opacity
            : 'transform translate-y-[150px] opacity-0'   // When closed, use translate-y-4 and 0 opacity
            }`}
            ref={emojiRef} // Reference to emoji picker container
          >
            <EmojiPicker theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button 
        className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none 
        hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all'
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl"/>
      </button>
    </div>
  )
}

export default MessageBar