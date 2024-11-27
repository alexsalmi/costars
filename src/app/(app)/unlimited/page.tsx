'use client'
import CSSearchBar from '@/components/inputs/search';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/pages/unlimited.scss';

export default function UnlimitedGame() {
	const { score, highScore } = useGameState();

  return (
    <div className='unlimited-page'>
			<CSSearchBar />
			<div className='unlimited-page-scores'>
				<CSTextDisplay>
					Current Score: {score}
				</CSTextDisplay>
				<CSTextDisplay>
					High Score: {highScore}
				</CSTextDisplay>
			</div>
			<CSCardTrack showPrompt />
    </div>
  );
}
