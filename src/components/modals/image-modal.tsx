import Image from 'next/image';
import { Modal } from '@mui/material';
import '@/styles/modals/image-modal.scss';
import CSButton from '../inputs/buttons/button';
import { CloseOutlined } from '@mui/icons-material';

interface ICSImageModalProps {
  isOpen: boolean;
  close?: () => void;
  entity?: GameEntity;
}

export default function CSImageModal({
  isOpen,
  close,
  entity,
}: ICSImageModalProps) {
  if (!isOpen || !entity) return <></>;

  return (
    <Modal open={isOpen} onClose={close} className='image-modal-container'>
      <div onClick={close} className='image-modal'>
        <CSButton secondary>
          <CloseOutlined />
        </CSButton>
        <Image
          className='card-image'
          src={`https://image.tmdb.org/t/p/original${entity.image}`}
          alt={`Picture of ${entity.label}`}
          width={350}
          height={525}
          unoptimized
        />
      </div>
    </Modal>
  );
}
