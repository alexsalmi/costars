'use client'
import useGameState from '@/store/game.state';
import CSCard from './card';
import '@/styles/components/card-track.scss'

interface ICSCardTrackProps {
	showPrompt?: boolean,
	cards?: Array<GameEntity>
}

export default function CSCardTrack({ showPrompt, cards }: ICSCardTrackProps) {
	const { history, hints, current, condensed } = useGameState();

	const cardsToDisplay = cards || history;

  return (
		<div className={`card-track-container ${!showPrompt ? 'no-prompt' : ''}`}>
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
				cardsToDisplay.map(entity => {
					return (
						<CSCard entity={entity} 
							reverse={entity.type === 'movie'} 
							condensed={condensed} 
							hintUsed={hints.some(hint => hint.id === entity.id && hint.type === entity.type)}
							key={entity.id}
						/>
					)
				})
			}
		</div>
  );
}
