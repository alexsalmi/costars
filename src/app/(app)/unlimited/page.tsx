'use client'
import CSSearchBar from '@/components/inputs/search';
import CSCardTrack from '@/components/presentation/cardTrack';
import CSTextDisplay from '@/components/presentation/display';
import '@/styles/pages/unlimited.scss';
import { useEffect, useState } from 'react';

export default function UnlimitedGame() {
	const [streak, setStreak] = useState([] as GameEntity[]);
	const [highScore, setHighScore] = useState(0);

	useEffect(() => {
		setHighScore(parseInt(localStorage.getItem('costars-highscore') || '0'))
	}, []);

	const addNew = (guess: GameEntity) => {
		setStreak([guess, ...streak]);
		if (streak.length >= highScore) {
			localStorage.setItem('costars-highscore', (highScore + 1).toString());
			setHighScore(highScore + 1);
		}
	}

	const getPrompt = () => {
		const current = streak[0];
		if (!current)
			return 'Enter any actor to begin!';

		return current.type === 'person' ?
			`What else has ${current.label} been in?` :
			`Who else was in ${current.label}?` 
	}

  return (
    <div className='unlimited-page'>
			<CSSearchBar current={streak[0]} add={addNew}></CSSearchBar>
			<div className='unlimited-page-scores'>
				<CSTextDisplay>
					Current Score: {streak.length}
				</CSTextDisplay>
				<CSTextDisplay>
					High Score: {highScore}
				</CSTextDisplay>
			</div>
			<CSCardTrack values={streak} prompt={getPrompt()} />
    </div>
  );
}
