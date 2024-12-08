'use client'
import CSCardTrack from '@/components/presentation/card-track';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';
import { useState } from 'react';
import CSStatsModal from './stats-modal';

export default function Success({dailySolutions} : {dailySolutions?: DailySolutions}) {
  const { history, target, score, gameType } = useGameState();

  const [statsOpen, setStatsOpen] = useState(gameType === 'daily');

  return (
    <div className='success-container'>
      <div className='success-message-container'>
        <h3>Congratulations!</h3>
        <span>
          {'You connected '}
          <strong>{history[history.length - 1].label}</strong>
          {' and '}
          <strong>{target.label}</strong>
          {' in '}
          <strong>
            {(score - 1) / 2} {score < 4 ? 'movie!' : 'movies!'}
          </strong>
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
        <CSStatsModal isOpen={statsOpen} close={() => setStatsOpen(false)} dailySolutions={dailySolutions}/>
        : <></>
      }
    </div>
  );
}
