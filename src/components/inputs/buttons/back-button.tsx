'use client'
import CSButton from './button';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import '@/styles/inputs/back-button.scss';

export default function CSBackButton() {
  return (
    <div className='back-button-container'>
      <CSButton secondary onClick={() => window.history.back()}>
        <KeyboardArrowLeftOutlined />
        Back
      </CSButton>
    </div>
  );
}
