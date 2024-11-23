import { MouseEventHandler } from 'react';
import '@/styles/components/button.scss'

interface ICSButtonProps {
	primary?: boolean,
	secondary?: boolean,
	value?: string,
	onClick?: MouseEventHandler<HTMLButtonElement>,
	children?: React.ReactNode,
}

export default function CSbutton({primary, secondary, onClick, children}: ICSButtonProps) {
  return (
		<button className={`cs-button primary ${primary || ! secondary ? 'primary' : 'secondary'}`}
			onClick={onClick}
		>
			{ children || 'Button'}
		</button>
  );
}
