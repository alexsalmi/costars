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
		<div className='modal-background' onClick={() => close && close()}>
			<div className={`modal-container ${className || ''}`} onClick={(e) => e.stopPropagation()}>
				{close ?
					<div className='modal-close-button'>
						<CSButton secondary onClick={(e) => {
								e.stopPropagation();
								close();
							}}
						>
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
