import { MouseEventHandler } from 'react';
import '@/styles/components/button.scss'
import { CircularProgress } from '@mui/material';

interface ICSButtonProps {
	primary?: boolean,
	secondary?: boolean,
	value?: string,
	onClick?: MouseEventHandler<HTMLButtonElement>,
	children?: React.ReactNode,
	disabled?: boolean,
	loading?: boolean
}

export default function CSButton({primary, secondary, onClick, children, disabled, loading}: ICSButtonProps) {
  return (
		<button
			className={
				`cs-button primary 
				${primary || !secondary ? 'primary' : 'secondary'} 
				${disabled ? 'disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{
				loading ?
					<CircularProgress size="24px" />
				:
					children || 'Button'
				}
		</button>
  );
}
