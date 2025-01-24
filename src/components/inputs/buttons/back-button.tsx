'use client';
import CSButton from './button';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import '@/styles/inputs/back-button.scss';
import { redirect, RedirectType } from 'next/navigation';

interface ICSBackButtonProps {
  link?: string;
}

export default function CSBackButton({ link }: ICSBackButtonProps) {
  const handleClick = () => {
    if (link) redirect(link, RedirectType.push);
    else window.history.back();
  };

  return (
    <div className='back-button-container'>
      <CSButton secondary onClick={handleClick}>
        <KeyboardArrowLeftOutlined />
        Back
      </CSButton>
    </div>
  );
}
