'use client';
import CSCardTrack from '@/components/presentation/card-track';
import useCostarsState from '@/store/costars.state';
import Link from 'next/link';
import CSButton from '../inputs/buttons/button';
import { useState } from 'react';
import CSStatsModal from '../modals/stats-modal';
import CSBackButton from '../inputs/buttons/back-button';
import { ShareOutlined } from '@mui/icons-material';
import { getScoreString } from '@/utils/utils';
import { sb_GetSolutions, sb_PostSolutions } from '@/services/supabase';
import '@/styles/game/success.scss';
import CSConfetti from '../presentation/confetti';

interface ISuccessProps {
  daily?: DailyCostars;
  solutions?: Array<Solution>;
}

export default function Success({ daily, solutions }: ISuccessProps) {
  const { history, target, score, hints, gameType, user } = useCostarsState();

  const [shareLoading, setShareLoading] = useState(false);
  const [statsOpen, setStatsOpen] = useState(
    gameType === 'daily' || gameType === 'archive',
  );

  const numMovies = (score - 1) / 2;
  const numHints = history.reduce(
    (acc, curr) =>
      acc +
      (hints.some((hint) => hint.id === curr.id && hint.type === curr.type)
        ? 1
        : 0),
    0,
  );

  const shareScore = async (loadingFn = setShareLoading) => {
    loadingFn(true);
    let uuid = '';

    if (user && gameType === 'daily' && daily) {
      const [solution] = await sb_GetSolutions({
        user_id: user.id,
        daily_id: daily.id,
      });

      uuid = solution.id || '';
    } else {
      uuid = await sb_PostSolutions({
        solution: history,
        hints,
        is_temporary: true,
        daily_id: daily?.id,
      });
    }

    loadingFn(false);

    let label = `${history[0].label} ➡️ ${target.label}\n${getScoreString(history, hints)}\n\nCheck out my solution!`;

    if (daily) label = `Daily Costars #${daily.day_number}\n${label}`;

    try {
      window.navigator.share({
        title: 'Costars',
        text: label,
        url: `${location.origin}/solution/${uuid}`,
      });
    } catch {
      window.navigator.clipboard.writeText(
        `${location.origin}/solution/${uuid}`,
      );
    }
  };

  return (
    <>
      <CSBackButton />
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
            {numHints > 0 ? (
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint!' : 'hints!'}
                </strong>
              </>
            ) : (
              <span>!</span>
            )}
          </span>
        </div>
        <div className='success-buttons-container'>
          <CSButton
            secondary
            onClick={() => shareScore()}
            loading={shareLoading}
          >
            <ShareOutlined />
            Share
          </CSButton>
          {gameType === 'daily' ? (
            <CSButton onClick={() => setStatsOpen(true)}>See Stats</CSButton>
          ) : gameType === 'archive' ? (
            <CSButton onClick={() => setStatsOpen(true)}>
              See Solutions
            </CSButton>
          ) : (
            <Link href='/custom'>
              <CSButton>New Game</CSButton>
            </Link>
          )}
        </div>
        <hr />
        <div className='success-solution-container'>
          <h3>Your Solution:</h3>
          <CSCardTrack condenseEnds />
        </div>
        {daily && statsOpen ? (
          <CSStatsModal
            isOpen={statsOpen}
            close={() => setStatsOpen(false)}
            daily={daily}
            solutions={solutions!}
            showStats={gameType === 'daily'}
            shareFn={shareScore}
          />
        ) : (
          <></>
        )}
      </div>
      {gameType === 'daily' ? (
        <CSConfetti stars={numMovies === 2 && numHints === 0} />
      ) : (
        <></>
      )}
    </>
  );
}
