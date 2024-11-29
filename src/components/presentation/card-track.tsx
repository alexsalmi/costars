import useGameState from '@/store/game.state';
import CSCard from './card';
import '@/styles/components/card-track.scss'

interface ICSCardTrackProps {
	showPrompt?: boolean
}

export default function CSCardTrack({ showPrompt }: ICSCardTrackProps) {
	const { history, current, condensed } = useGameState();

  return (
		<div className='card-track-container'>
			{ showPrompt ? 
				<span className='card-track-prompt'>
					{
						!current ? 
							'Enter any actor to begin!'
						: history.length === 1 ?
							`What has ${current.label} been in?`
						: current.type === 'person' ? 
							`What else has ${current.label} been in?`
						:
							`Who else was in ${current.label}?`
					}
				</span>
				: <></>
			}
			{
				history.map(entity => {
					return <CSCard entity={entity} reverse={entity.type === 'movie'} condensed={condensed} key={entity.id}/>
				})
			}
		</div>
  );
}
