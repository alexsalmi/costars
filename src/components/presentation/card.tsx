import '@/styles/components/card.scss'
import Image from 'next/image';

interface ICSCardProps {
	image: string,
	label: string,
	actor?: boolean,
	movie?: boolean,
	target?: boolean,
	condensed?: boolean
}

export default function CSCard({image, label, actor, movie, target, condensed}: ICSCardProps) {
  return (
		<div className={`
			card-container 
			${actor || !movie ? 'reverse ' : ''}
			${target ? 'target ' : ''}
			${condensed ? 'condensed' : ''}
		`}>
			{ !condensed ? 
				<Image className='card-image' 
					src={image} alt={`Picture of ${label}`} width={80} height={120}/>
				: <></>
			}
			<span className='card-label'>
				{label}
			</span>
		</div>
  );
}
