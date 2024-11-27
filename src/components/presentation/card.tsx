import useGameState from '@/store/game.state';
import '@/styles/components/card.scss'
import Image from 'next/image';

interface ICSCardProps {
	entity: GameEntity,
	reverse?: boolean,
	target?: boolean
}

export default function CSCard({entity, reverse, target}: ICSCardProps) {
	const {condensed} = useGameState();
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
				{entity.label}
			</span>
		</div>
  );
}
