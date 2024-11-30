'use client'
import CSCardTrack from '@/components/presentation/card-track';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';

export default function Success() {
	const { history, target, score } = useGameState();

  return (
    <div className='success-container'>
      <div className='success-message-container'>
        <h3>Congrats!</h3>
        <div className='success-message'>
          <span>You connected</span>
          <span>
            <strong>{history[history.length - 1].label}</strong>
            {' and '}
            <strong>{target.label}</strong>
          </span>
          <span>
            {'in '}
            <strong>
              {(score - 1) / 2} {score < 4 ? 'movie!' : 'movies!'}
            </strong>
          </span>
        </div>
        <Link href="/custom">
          <CSButton>
            New Game
          </CSButton>
        </Link>
      </div>
      <CSCardTrack />
    </div>
  );
}
