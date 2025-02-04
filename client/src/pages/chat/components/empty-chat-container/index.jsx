import Lottie from 'react-lottie'
import { animationDefautlOptions } from '../../../../lib/utils'

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
        <Lottie
            isClickToPauseDisabled={true} // Prevents pausing the animation when clicked
            height={200} // Sets the height of the animation to 200 pixels
            width={200}  // Sets the width of the animation to 200 pixels
            options={animationDefautlOptions} // Uses the defined animation options
        />
        <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
            <h3 className='poppins-medium'>
                Hi<span className='text-purple-500'>!</span> Welcome to
                <span className='text-purple-500'> LINQ</span>
            </h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer