import { MouseEventHandler } from 'react';
import '@/styles/inputs/button.scss';
import { CircularProgress } from '@mui/material';

interface ICSButtonProps {
  primary?: boolean;
  secondary?: boolean;
  value?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
}

export default function CSButton({
  primary,
  secondary,
  onClick,
  children,
  disabled,
  loading,
  selected,
}: ICSButtonProps) {
  return (
    <button
      className={`cs-button 
				${primary || !secondary ? 'primary ' : 'secondary '} 
				${disabled ? 'disabled ' : ''}
        ${selected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <CircularProgress size='24px' /> : children || 'Button'}
    </button>
  );
}
