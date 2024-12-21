'use client'
import { AccountCircleOutlined, HelpOutlineOutlined, DarkModeOutlined, CalendarMonthOutlined } from '@mui/icons-material';
import CSButton from '@/components/inputs/button';
import { useState } from 'react';
import CSProfileModal from '../modals/profile-modal';

export default function CSNavMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  
  return (
    <>
      <div className='header-nav'>
        {/* <CSButton secondary>
          <DarkModeOutlined />
        </CSButton>
        <CSButton secondary>
          <HelpOutlineOutlined />
        </CSButton>
        <CSButton secondary>
          <CalendarMonthOutlined />
        </CSButton> */}
        <CSButton secondary onClick={() => setProfileOpen(true)}>
          <AccountCircleOutlined />
        </CSButton>
      </div>
      <CSProfileModal isOpen={profileOpen} close={() => setProfileOpen(false) } />
    </>
  );
}
