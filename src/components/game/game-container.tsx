'use client'
import CSSearchBar from '@/components/inputs/search';
import CSToolbar from '@/components/inputs/toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/game/game-container.scss';

export default function GameContainer() {
	const { score, highScore } = useGameState();

  return (
		<div className='game-container'>
			<CSSearchBar />
			<div className='game-scores'>
				<CSTextDisplay>
					Current Score: {score}
				</CSTextDisplay>
				<CSTextDisplay>
					High Score: {highScore}
				</CSTextDisplay>
			</div>
			<div className='game-card-section'>
				<CSToolbar />
				<CSCardTrack showPrompt />
			</div>
    </div>
  );
}
