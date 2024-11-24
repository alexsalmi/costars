import CSCard from './card';
import '@/styles/components/cardTrack.scss'

interface ICSCardTrackProps {
	values: Array<CardContent>,
	prompt?: string
}

export default function CSCardTrack({values, prompt}: ICSCardTrackProps) {
  return (
		<div className='card-track-container'>
			{ prompt ? 
				<span className='card-track-prompt'>
					{prompt}
				</span>
				: <></>
			}
			{
				values.map((content, ind) => {
					return <CSCard {...content} key={ind}/>
				})
			}
		</div>
  );
}
