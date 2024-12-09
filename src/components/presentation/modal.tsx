import '@/styles/components/modal.scss'
import CSButton from '../inputs/button';
import { CloseOutlined } from '@mui/icons-material';

interface ICSModalProps {
	children: React.ReactNode,
	isOpen: boolean,
	className?: string,
	close?: () => void
}

export default function CSModal({children, isOpen, className, close}: ICSModalProps) {
	if(!isOpen) return <></>;

  return (
		<div className='modal-background'>
			<div className={`modal-container ${className || ''}`}>
				{close ?
					<div className='modal-close-button'>
						<CSButton secondary onClick={() => close()}>
							<CloseOutlined/>
						</CSButton>
					</div>
				: <></>
				}
				{children}
			</div>
		</div>
  );
}
