import Image from 'next/image';
import { Modal } from '@mui/material';
import '@/styles/modals/image-modal.scss';
import CSButton from '../inputs/buttons/button';
import { CloseOutlined } from '@mui/icons-material';

interface ICSImageModalProps {
  isOpen: boolean;
  close?: () => void;
  entity: GameEntity;
}

export default function CSImageModal({
  isOpen,
  close,
  entity,
}: ICSImageModalProps) {
  if (!isOpen) return <></>;

  return (
    <Modal open={isOpen} onClose={close} className='image-modal'>
      <div onClick={close}>
        <CSButton secondary>
          <CloseOutlined />
        </CSButton>
        <Image
          className='card-image'
          src={`https://image.tmdb.org/t/p/w300${entity.image}`}
          alt={`Picture of ${entity.label}`}
          width={300}
          height={450}
          placeholder='blur'
          blurDataURL='/placeholder.webp'
          unoptimized
        />
      </div>
    </Modal>
  );
}
