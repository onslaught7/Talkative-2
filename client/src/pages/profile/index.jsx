import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { FaPlus, FaTrash } from "react-icons/fa"
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api-client'
import { colors, getColor } from '../../lib/utils'
import { ADD_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE } from '../../utils/constants'
// import { FaPlus } from "react-icons/fa"

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectColor] = useState(0);

  // returns a mutable object called ref that holds a current property
  // Create a reference for the file input element
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Runs whenever userInfo changes
    if (userInfo.profileSetup) {
      // If the user has set up their profile, update state variables
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    return true;
  }

  const saveChanges = async() => {
    if (validateProfile()) {
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE, 
        { firstName, lastName, color: selectColor},
        // This option ensures that cookies are sent along with the request
        { withCredentials:true }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully.");
        // Navigate is used for the client side routing
        navigate("/chat");
      }
    }
  }

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  }

  const handleFileInputClick = () => {
    // Access the current DOM element assigned to fileInputRef and trigger a click
    fileInputRef.current.click();
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({file});

    if (file) {
      // Create a FormData object to send the file in an HTTP request
      const formData = new FormData();
      formData.append("profile-image", file); // Append the file with the key "profile-image"

      // Send the file to the server using an API client
      const response = await apiClient.post(
        ADD_PROFILE_IMAGE_ROUTE, 
        formData,
        { withCredentials: true } // Ensures cookies are sent with the request (for authentication)
      );

      if (response.status === 200 && response.data.image) {
        setUserInfo({...userInfo, image: response.data.image });
        toast.success("Profile image updated successfully");
      }

      
    }
  }

  const handleDeleteImage = async () => {
    try {
      // Send a DELETE request to the backend to remove the user's profile image
      // `withCredentials: true` ensures that cookies (e.g., authentication tokens) are sent along with the request
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // This ensures that the UI reflects the updated user info after deletion
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.");
        setImage(null);
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer'/>
        </div>
        <div className='grid grid-cols-2'>
          <div 
            className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            >
            <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
              {
                image ? (
                  <AvatarImage src={image} alt="profile" className='object-cover w-full h-full bg-black'/>
                ) : ( 
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectColor)}`}>
                    {
                      firstName 
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()
                    }
                  </div>
                )
              }
            </Avatar>
            {
              hovered && (
                <div 
                  className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full' 
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {
                    image ? (
                      <FaTrash className='text-white text-3xl cursor-pointer'/> 
                    ) : (
                      <FaPlus className='text-white text-3xl cursor-pointer'/>
                    )
                  }
                </div>
              )
            }
            {/* accept image inputs */}
            <input 
              type='file' 
              ref={fileInputRef} 
              className='hidden' 
              onChange={handleImageChange} 
              name="profile-image"
              accept='.png, .jpg, .jpeg, .webp, .svg'
            />
          </div>
          <div className='flex m-w-32 md:m-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div className='w-full'>
              <Input 
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className='w-full'>
              <Input 
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className='w-full'>
              <Input 
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className='full flex gap-5'>
              {
                colors.map((color, index) => 
                  <div
                    className={
                      `${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                      ${
                        selectColor === index 
                        ? "outline outline-white/80 outline-2"
                        : ""
                      }`
                    }
                    key={ index }
                    onClick={() => setSelectColor(index)}
                  ></div>
                )
              }
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile