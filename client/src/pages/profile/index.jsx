import React from 'react'
import { useAppStore } from '@/store'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Avatar } from '@/components/ui/avatar'
import { colors, getColor } from '../../lib/utils'
import { FaTrash, FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { FaPlus } from "react-icons/fa"

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectColor] = useState(0);

  const saveChanges = async() => {

  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
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
                <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full'>
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
          </div>
          {/* <input/> */}
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