import { useAppStore } from "../store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from '@/components/ui/avatar'
// import { AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from '@/lib/utils.js'

const ContactList = ({contacts, ischannel = false}) => {
    const {
        selectedChatData, 
        setSelectedChatData, 
        setSelectedChatType, 
        selectedChatType,
        setSelectedChatMessages,
    } = useAppStore();

    const handleClick = (contact) => {
        if (ischannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
        // console.log(contact);
    }

    // console.log(contacts);
    // console.log(ischannel);

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                        ${selectedChatData && selectedChatData._id === contact._id 
                        ? "bg-[#8417ff] hover:bg-[#8417ff]" 
                        : "hover:bg-[#f1f1f111]"}`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !ischannel && (
                            <Avatar className='h-10 w-10 rounded-full overflow-hidden'>
                            {
                            contact.image ? (
                                <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className='object-cover w-full h-full bg-black'/>
                            ) : ( 
                                <div 
                                className={
                                `uppercase h-10 w-10 text-lg border-[1px] flex items-center 
                                justify-center rounded-full ${getColor(contact.color)}`
                                }
                                >
                                {
                                   contact.firstName 
                                    ? contact.firstName.split("").shift()
                                    : contact.email.split("").shift()
                                }
                                </div>
                            )
                            }
                            </Avatar>
                            )
                        }
                        {
                           ischannel && 
                           (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                            #
                           </div> )
                        }
                        {
                            ischannel ? (
                                <span>{contact.name}</span> 
                            ) : (
                                <span>{`${contact.firstName} ${contact.lastName}`}</span>
                            )
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactList