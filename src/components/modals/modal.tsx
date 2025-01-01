import CSButton from '../inputs/buttons/button';
import { CloseOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';
import '@/styles/modals/modal.scss';

interface ICSModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  close?: () => void;
}

export default function CSModal({
  children,
  isOpen,
  className,
  close,
}: ICSModalProps) {
  if (!isOpen) return <></>;

  return (
    <Modal open={isOpen} sx={{ overflowY: 'scroll' }} onClose={close}>
      <div className={`modal-container ${className || ''}`}>
        {close ? (
          <div className='modal-close-button'>
            <CSButton
              secondary
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              <CloseOutlined />
            </CSButton>
          </div>
        ) : (
          <></>
        )}
        {children}
      </div>
    </Modal>
  );
}
