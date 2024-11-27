import { MouseEventHandler } from 'react';
import '@/styles/components/button.scss'

interface ICSButtonProps {
	primary?: boolean,
	secondary?: boolean,
	value?: string,
	onClick?: MouseEventHandler<HTMLButtonElement>,
	children?: React.ReactNode,
	disabled?: boolean
}

export default function CSButton({primary, secondary, onClick, children, disabled}: ICSButtonProps) {
  return (
		<button
			className={
				`cs-button primary 
				${primary || !secondary ? 'primary' : 'secondary'} 
				${disabled ? 'disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{ children || 'Button'}
		</button>
  );
}
