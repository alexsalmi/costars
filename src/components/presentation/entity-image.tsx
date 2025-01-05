'use client';
import Image from 'next/image';
import { useState } from 'react';
import CSImageModal from '../modals/image-modal';
import '@/styles/presentation/entity-image.scss';

interface ICSEntityImageProps {
  entity: GameEntity;
  unoptimized?: boolean;
  width?: number;
  height?: number;
}

export default function CSEntityImage({
  entity,
  unoptimized,
  width,
  height,
}: ICSEntityImageProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsImageOpen(true);
        }}
        className='entity-image'
        style={{ height: height || 120 }}
      >
        <Image
          className='card-image'
          src={`https://image.tmdb.org/t/p/w185${entity.image}`}
          alt={`Picture of ${entity.label}`}
          width={width || 80}
          height={height || 120}
          placeholder='blur'
          blurDataURL='/placeholder.webp'
          priority={!unoptimized}
          unoptimized={unoptimized}
        />
      </div>
      <CSImageModal
        isOpen={isImageOpen}
        close={() => setIsImageOpen(false)}
        entity={entity}
      />
    </div>
  );
}
