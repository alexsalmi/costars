'use client'
import GameContainer from '@/components/game/game-container';
import useGameState from '@/store/game.state';
import '@/styles/pages/unlimited.scss';
import { useEffect } from 'react';

export default function UnlimitedGame() {
	const { initUnlimitedGame } = useGameState();

	useEffect(() => {
		initUnlimitedGame();
	}, []);

  return (
		<GameContainer />
  );
}
