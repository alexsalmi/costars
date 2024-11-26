'use client'
import CSSearchBar from '@/components/inputs/search';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/pages/unlimited.scss';

export default function UnlimitedGame() {
	const { history, score, highScore, addEntity } = useGameState();

	const getPrompt = () => {
		const current = history[0];
		if (!current)
			return 'Enter any actor to begin!';

		return current.type === 'person' ?
			`What else has ${current.label} been in?` :
			`Who else was in ${current.label}?` 
	}

  return (
    <div className='unlimited-page'>
			<CSSearchBar current={history[0]} add={addEntity}></CSSearchBar>
			<div className='unlimited-page-scores'>
				<CSTextDisplay>
					Current Score: {score}
				</CSTextDisplay>
				<CSTextDisplay>
					High Score: {highScore}
				</CSTextDisplay>
			</div>
			<CSCardTrack values={history} prompt={getPrompt()} />
    </div>
  );
}
