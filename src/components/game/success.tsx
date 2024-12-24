'use client'
import CSCardTrack from '@/components/presentation/card-track';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';
import { useState } from 'react';
import CSStatsModal from '../modals/stats-modal';
import CSBackButton from '../inputs/back-button';

export default function Success() {
  const { history, target, score, hints, gameType } = useGameState();

  const [statsOpen, setStatsOpen] = useState(gameType === 'daily');

	const numMovies = (score-1)/2;
	const numHints = history.reduce(
		(acc, curr) => 
			acc + (hints.some(hint => hint.id === curr.id && hint.type === curr.type) ? 1 : 0), 
		0
	);

  return (
    <>
      <CSBackButton/>
      <div className='success-container'>
        <div className='success-message-container'>
          <h3>Congratulations!</h3>
          <span>
            {'You connected '}
            <strong>{history[0].label}</strong>
            {' and '}
            <strong>{target.label}</strong>
            {' in '}
            <strong>
              {numMovies} {numMovies === 1 ? 'movie' : 'movies'}
            </strong>
            {
              numHints > 0 ?
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint!' : 'hints!'}
                </strong>
              </>
              :
              <span>!</span>
            }
          </span>
          {gameType !== 'daily' ?
            <Link href="/custom">
              <CSButton>
                New Game
              </CSButton>
            </Link>
            : <CSButton onClick={() => setStatsOpen(true)}>See Stats</CSButton>
          }
        </div>
        <CSCardTrack />
        {gameType === 'daily' ?
          <CSStatsModal isOpen={statsOpen} close={() => setStatsOpen(false)} />
          : <></>
        }
      </div>
    </>
  );
}
