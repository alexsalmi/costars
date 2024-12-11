'use client'
import '@/styles/components/card.scss'
import Image from 'next/image';
import { ExpandMoreOutlined, ExpandLessOutlined } from '@mui/icons-material';
import { useState } from 'react';
import CSDetailsModal from './details-modal';
import CSButton from '../inputs/button';

interface ICSCardProps {
	entity: GameEntity,
	reverse?: boolean,
	target?: boolean,
	condensed?: boolean,
	hintUsed?: boolean
}

export default function CSCard({entity, reverse, target, condensed, hintUsed}: ICSCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [targetCondensed, setTargetCondensed] = useState(false);
	
	return (
		<>
			<div className={`
					card-container 
					${reverse ? 'reverse ' : ''}
					${target ? 'target ' : ''}
					${condensed || targetCondensed ? 'condensed ' : ''}
					${hintUsed ? 'hintUsed' : ''}
				`}
				onClick={(e) => {
					e.stopPropagation();
					setIsDetailsOpen(true)
				}}
			>
				{ !condensed && !targetCondensed ? 
					<Image className='card-image' 
						src={`https://image.tmdb.org/t/p/w185${entity.image}`} alt={`Picture of ${entity.label}`} width={80} height={120}
						placeholder='blur'
						blurDataURL='/placeholder.webp'
					/>
					: <></>
				}
				<span className='card-label'>
					{target ? <h4>Target:</h4> : ''}
					{entity.label}
				</span>
				{target ? 
					<CSButton
						onClick={(e) => {
							e.stopPropagation();
							setTargetCondensed(!targetCondensed);
						}}
					>
						{ targetCondensed ?
							<ExpandMoreOutlined className='card-expandable-icon'/>
							:
							<ExpandLessOutlined className='card-expandable-icon'/>
						}
					</CSButton>
					: <></>
				}
			</div>
			{isDetailsOpen ?
				<CSDetailsModal 
					isOpen={isDetailsOpen} 
					close={() => setIsDetailsOpen(false)}
					entity={entity}	
				/>
				: <></>
			}
		</>
  );
}
