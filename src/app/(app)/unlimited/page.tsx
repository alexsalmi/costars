'use client'
import CSSearchBar from '@/components/inputs/search';
import CSToolbar from '@/components/inputs/toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/pages/unlimited.scss';
import { useEffect } from 'react';

export default function UnlimitedGame() {
	const { score, highScore, initUnlimitedGame } = useGameState();

	useEffect(() => {
		initUnlimitedGame();
	}, []);

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
			<div className='unlimited-page-card-section'>
				<CSToolbar />
				<CSCardTrack showPrompt />
			</div>
    </div>
  );
}
