import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useAppStore } from "@/store"
import { useSocket } from "@/context/SocketContext"


const MessageBar = () => {
  const emojiRef = useRef();
  const emojiButtonRef = useRef();
  const {selectedChatType, selectedChatData, userInfo} = useAppStore();
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
        />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
          // onClick={}
        >
          <GrAttachment className="text-2xl"/>
        </button>
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