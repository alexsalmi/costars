'use client'
import { AccountCircleOutlined, DarkModeOutlined, HelpOutlineOutlined, LightModeOutlined } from '@mui/icons-material';
import CSButton from '@/components/inputs/button';
import { useEffect, useState } from 'react';
import CSProfileModal from '../modals/profile-modal';
import { useTheme } from 'next-themes';
import CSHowToModal from '../modals/how-to-modal';

export default function CSNavMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [mount, setMount] = useState(false);
  const {systemTheme, theme, setTheme} = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMount(true);
  }, []);
  
  return (
    <>
      <div className='header-nav'>
        {mount ?
          <CSButton secondary onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}>
            {currentTheme === "light" ?
              <DarkModeOutlined />
              :
              <LightModeOutlined />
            }
          </CSButton>
          : <CSButton secondary><LightModeOutlined /></CSButton>
        }
        <CSButton secondary onClick={() => setHowToOpen(true)}>
          <HelpOutlineOutlined />
        </CSButton>
        <CSButton secondary onClick={() => setProfileOpen(true)}>
          <AccountCircleOutlined />
        </CSButton>
      </div>
      <CSProfileModal isOpen={profileOpen} close={() => setProfileOpen(false) } />
      <CSHowToModal isOpen={howToOpen} close={() => setHowToOpen(false) } />
    </>
  );
}
