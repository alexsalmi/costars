'use client'
import CSCardTrack from '@/components/presentation/card-track';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';
import CSTextDisplay from '../presentation/display';

export default function Success() {
  const { history, target, score, gameType, dailyStats } = useGameState();

  return (
    <div className='success-container'>
      <div className='success-message-container'>
        <h3>Congrats!</h3>
        <div className='success-message'>
          <span>
            {'You connected '}
            <strong>{history[history.length - 1].label}</strong>
            {' and '}
            <strong>{target.label}</strong>
            {' in '}
          </span>
          <span>
            <strong>
              {(score - 1) / 2} {score < 4 ? 'movie!' : 'movies!'}
            </strong>
          </span>
        </div>
        {gameType === 'daily' ?
          <div className='success-stats'>
            <CSTextDisplay>
              <span>{dailyStats.daysPlayed}</span>
              <span>Days Played</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{dailyStats.currentStreak}</span>
              <span>Current Streak</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{dailyStats.highestStreak}</span>
              <span>Highest Streak</span>
            </CSTextDisplay>
          </div>
          : 
          <Link href="/custom">
            <CSButton>
              New Game
            </CSButton>
          </Link>
        }
      </div>
      <CSCardTrack />
    </div>
  );
}
