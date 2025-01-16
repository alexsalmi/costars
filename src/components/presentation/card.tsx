'use client';
import {
  ExpandMoreOutlined,
  ExpandLessOutlined,
  QuestionMarkOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import CSDetailsModal from '../modals/details-modal';
import CSButton from '../inputs/buttons/button';
import { Tooltip } from '@mui/material';
import '@/styles/presentation/card.scss';
import CSImageModal from '../modals/image-modal';
import CSEntityImage from './entity-image';

interface ICSCardProps {
  entity: GameEntity;
  reverse?: boolean;
  target?: boolean;
  condensed?: boolean;
  hintUsed?: boolean;
  hideHints?: boolean;
  highlight?: boolean;
}

export default function CSCard({
  entity,
  reverse,
  target,
  condensed,
  hintUsed,
  hideHints,
  highlight,
}: ICSCardProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
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
					${highlight ? 'highlight ' : ''}
				`}
        onClick={(e) => {
          e.stopPropagation();
          setIsDetailsOpen(true);
        }}
      >
        <CSEntityImage
          entity={entity}
          height={!condensed && !targetCondensed ? 120 : 1}
          width={!condensed && !targetCondensed ? 80 : 1}
          unoptimized
        />
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
      {isImageOpen ? (
        <CSImageModal
          isOpen={isImageOpen}
          close={() => setIsImageOpen(false)}
          entity={entity}
        />
      ) : (
        <></>
      )}
    </>
  );
}
