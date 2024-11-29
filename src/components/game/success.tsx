'use client'
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';

export default function Success() {
	const { history, target, score } = useGameState();

  return (
    <div className='success-container'>
      <CSTextDisplay>
        <h3>Congrats!</h3>
        <div className='success-message'>
          <span>You connected {history[history.length - 1].label} and {target.label} in:</span>
          <span><strong>{score - 1} moves!</strong></span>
        </div>
        <Link href="/custom">
          <CSButton>
            New Game
          </CSButton>
        </Link>
      </CSTextDisplay>
      <CSCardTrack />
    </div>
  );
}
