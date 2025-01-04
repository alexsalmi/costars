'use client';
import {
  AccountCircleOutlined,
  CalendarMonthOutlined,
  DarkModeOutlined,
  HelpOutlineOutlined,
  LightModeOutlined,
} from '@mui/icons-material';
import CSButton from '@/components/inputs/buttons/button';
import { useEffect, useState } from 'react';
import CSProfileModal from '../modals/profile-modal';
import { useTheme } from 'next-themes';
import CSInfoModal from '../modals/info-modal';
import Link from 'next/link';

export default function CSNavMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [mount, setMount] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <div className='header-nav'>
        {mount ? (
          <CSButton
            secondary
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
          >
            {currentTheme === 'light' ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </CSButton>
        ) : (
          <CSButton secondary>
            <LightModeOutlined />
          </CSButton>
        )}
        <Link href='/daily/archive'>
          <CSButton secondary>
            <CalendarMonthOutlined />
          </CSButton>
        </Link>
        <CSButton secondary onClick={() => setHowToOpen(true)}>
          <HelpOutlineOutlined />
        </CSButton>
        <CSButton secondary onClick={() => setProfileOpen(true)}>
          <AccountCircleOutlined />
        </CSButton>
      </div>
      <CSProfileModal
        isOpen={profileOpen}
        close={() => setProfileOpen(false)}
      />
      <CSInfoModal isOpen={howToOpen} close={() => setHowToOpen(false)} />
    </>
  );
}
