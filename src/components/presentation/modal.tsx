import '@/styles/components/modal.scss'
import CSButton from '../inputs/button';
import { CloseOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';

interface ICSModalProps {
	children: React.ReactNode,
	isOpen: boolean,
	className?: string,
	close?: () => void
}

export default function CSModal({children, isOpen, className, close}: ICSModalProps) {
	if(!isOpen) return <></>;

  return (
		<Modal open={isOpen} sx={{overflowY: 'scroll'}}>
			<div className={`modal-container ${className || ''}`}>
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
			</Modal>
  );
}
