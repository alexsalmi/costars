'use client';
import '@/styles/components/card.scss';
import Image from 'next/image';
import {
  ExpandMoreOutlined,
  ExpandLessOutlined,
  QuestionMarkOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import CSDetailsModal from '../modals/details-modal';
import CSButton from '../inputs/button';
import { Tooltip } from '@mui/material';

interface ICSCardProps {
  entity: GameEntity;
  reverse?: boolean;
  target?: boolean;
  condensed?: boolean;
  hintUsed?: boolean;
  hideHints?: boolean;
}

export default function CSCard({
  entity,
  reverse,
  target,
  condensed,
  hintUsed,
  hideHints,
}: ICSCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [targetCondensed, setTargetCondensed] = useState(target);

  return (
    <>
      <div
        className={`
					card-container 
					${reverse ? 'reverse ' : ''}
					${target ? 'target ' : ''}
					${condensed || targetCondensed ? 'condensed ' : ''}
				`}
        onClick={(e) => {
          e.stopPropagation();
          setIsDetailsOpen(true);
        }}
      >
        {!condensed && !targetCondensed ? (
          <Image
            className='card-image'
            src={`https://image.tmdb.org/t/p/w185${entity.image}`}
            alt={`Picture of ${entity.label}`}
            width={80}
            height={120}
            placeholder='blur'
            blurDataURL='/placeholder.webp'
          />
        ) : (
          <></>
        )}
        <span className='card-label'>
          {target ? <h4>Target:</h4> : ''}
          {entity.label}
        </span>
        {target ? (
          <span className='card-expand-icon'>
            <CSButton
              onClick={(e) => {
                e.stopPropagation();
                setTargetCondensed(!targetCondensed);
              }}
            >
              {targetCondensed ? (
                <ExpandMoreOutlined />
              ) : (
                <ExpandLessOutlined />
              )}
            </CSButton>
          </span>
        ) : (
          <></>
        )}

        {hintUsed && !hideHints ? (
          <span className='card-hint-icon'>
            <Tooltip title={`A hint was used on ${entity.label}`}>
              <QuestionMarkOutlined />
            </Tooltip>
          </span>
        ) : (
          <></>
        )}
      </div>
      {isDetailsOpen ? (
        <CSDetailsModal
          isOpen={isDetailsOpen}
          close={() => setIsDetailsOpen(false)}
          entity={entity}
        />
      ) : (
        <></>
      )}
    </>
  );
}
