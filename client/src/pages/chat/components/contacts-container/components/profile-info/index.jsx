import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants'
import { getColor } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { FiEdit2 } from 'react-icons/fi'
import { Navigate, useNavigate } from 'react-router-dom'
import { IoLogOut } from 'react-icons/io5'
import { apiClient } from '@/lib/api-client'
import { LOGOUT_ROUTE } from '@/utils/constants'

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore()

  // On logout we delete the cookie
  const logout = async () => {
    // Sending a POST request to the server's /logout endpoint
    try{
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {}, // Empty body for the request as no additional data is needed
        { withCredentials: true } // Include credentials (cookies) with the request, so the cookie is sent to the server
      );

      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className='w-12 h-12 relative'>
          <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
            {
              userInfo.image ? (
                <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className='object-cover w-full h-full bg-black'/>
              ) : ( 
                <div 
                className={
                  `uppercase h-12 w-12 text-lg border-[1px] flex items-center 
                  justify-center rounded-full ${getColor(userInfo.color)}`
                  }
                >
                  {
                    userInfo.firstName 
                    ? userInfo.firstName.split("").shift()
                    : userInfo.email.split("").shift()
                  }
                </div>
              )
            }
          </Avatar>
        </div>
        <div>
          {
            userInfo.firstName 
            ? `${userInfo.firstName} ${userInfo.lastName}` 
            : ""
          }
        </div>
      </div>
      <div className='flex gap-5'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
           <FiEdit2 
            className='text-purple-500 text-xl font-medium'
            onClick={() => navigate("/profile")}
           />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
            Edit Profile
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
           <IoLogOut 
            className='text-red-500 text-xl font-medium'
            onClick={logout} // logout function hits the logout route
           />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
            logout
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      </div>
    </div>
  )
}

export default ProfileInfo