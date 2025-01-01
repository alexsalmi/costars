import Link from 'next/link';
import CSButton from './button';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import '@/styles/inputs/back-button.scss';

interface ICSBackButtonProps {
  link?: string;
}

export default function CSBackButton({ link }: ICSBackButtonProps) {
  return (
    <Link href={link || '/'} className='back-button-container'>
      <CSButton secondary>
        <KeyboardArrowLeftOutlined />
        Back
      </CSButton>
    </Link>
  );
}
