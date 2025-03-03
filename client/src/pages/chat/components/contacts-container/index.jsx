import { useEffect } from 'react';
import NewDM from './components/new-dm/index';
import ProfileInfo from './components/profile-info/index'
import { apiClient } from '@/lib/api-client.js'
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/components/contact-list';
import CreateChannel from './components/create-channel';

const ContactsContainer = () => {
  const {directMessagesContacts, setDirectMessagesContacts} = useAppStore();

  console.log("directMessagesContacts, contacts-container:")
  console.log(directMessagesContacts)

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(
        GET_DM_CONTACTS_ROUTES,
        { withCredentials: true }
      );

      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    }

    getContacts();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div>
          <Logo/>
      </div>
      <div className="my-5">
          <div className="flex items-center justify-between pr-10">
              <Title text="Direct Messages"/>
              <NewDM/>
          </div>
          <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
          {/* directMessagesContacts variable is passed as a prop to the ContactList */}
            <ContactList contacts={directMessagesContacts}/> 
          </div>
      </div>
      <div className="my-5">
          <div className="flex items-center justify-between pr-10">
              <Title text="Channels"/>
              <CreateChannel/>
          </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Q-shaped Chat Icon */}
        <circle cx="20" cy="20" r="16" stroke="#8338ec" strokeWidth="3" fill="none" />
        <path
          d="M24 26 Q30 30, 34 26"
          stroke="#8338ec"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Eye Dot */}
        <circle cx="18" cy="18" r="2" fill="#8338ec" />
      </svg>
      {/* LINQ Text with only "Q" highlighted */}
      <span className="text-3xl font-semibold">
        LIN<span className="text-[#8338ec]">Q</span>
      </span>
    </div>
  );
};

const Title = ({text}) => {
  return (
      <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
          {text}
      </h6>
  )
}

  
  
  
  