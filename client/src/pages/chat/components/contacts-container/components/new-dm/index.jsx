import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import { animationDefautlOptions } from '@/lib/utils' 

const NewDM = () => {

  const [openNewContactModal, setOpenContactModal] = useState(false);
  const [SearchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {

  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus 
            className="text-neutral-400 font-light text-opacity-90 text-start
             hover:text-neutral-100 cursor-pointer transition-all duration-300"
             onClick={() => setOpenContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a contact</DialogTitle>
            <DialogDescription> 
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={e => searchContacts(e.target.value)}
            />    
          </div>
          {
            SearchedContacts.length <= 0 &&  (
              <div className="flex-1  md:flex flex-col mt-5 justify-center items-center duration-1000 transition-all">
                  <Lottie
                      isClickToPauseDisabled={true} // Prevents pausing the animation when clicked
                      height={100} // Sets the height of the animation to 200 pixels
                      width={100}  // Sets the width of the animation to 200 pixels
                      options={animationDefautlOptions} // Uses the defined animation options
                  />
                  <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                      <h3 className='poppins-medium'>
                          search new
                          <span className='text-purple-500'> contact</span>
                      </h3>
                  </div>
              </div>
            )
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewDM