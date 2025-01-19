import React from 'react'
import { useAppStore } from '@/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup your profile to continue");
      navigate("/profile");
    }
    // Runt the useEffect when the values in the array [userInfo, navigate] changes
  }, [userInfo, navigate]);


  return (
    <div>Chat</div>
  )
}

export default Chat