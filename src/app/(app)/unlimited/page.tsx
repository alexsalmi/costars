'use client';
import CSGameContainer from '@/components/game/game-container';
import useGameState from '@/store/game.state';
import { useEffect } from 'react';

export default function UnlimitedGame() {
  const { initUnlimitedGame } = useGameState();

  useEffect(() => {
    initUnlimitedGame();
  }, [initUnlimitedGame]);

  return <CSGameContainer />;
}
