'use client'
import '@/styles/components/card.scss'
import Image from 'next/image';

interface ICSCardProps {
	entity: GameEntity,
	reverse?: boolean,
	target?: boolean,
	condensed?: boolean
}

export default function CSCard({entity, reverse, target, condensed}: ICSCardProps) {
  return (
		<div className={`
			card-container 
			${reverse ? 'reverse ' : ''}
			${target ? 'target ' : ''}
			${condensed ? 'condensed' : ''}
		`}>
			{ !condensed ? 
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
		</div>
  );
}
