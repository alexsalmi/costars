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
import { getUser } from '@/services/supabase/auth.service';

interface ISuccessProps {
  daily?: DailyCostars;
  solutions?: Array<Solution>;
}

export default function Success({ daily, solutions }: ISuccessProps) {
  const { history, target, score, hints, gameType } = useCostarsState();

  const [shareLoading, setShareLoading] = useState(false);
  const [statsOpen, setStatsOpen] = useState(gameType === 'daily' || gameType === 'archive');

  const numMovies = (score - 1) / 2;
  const numHints = history.reduce(
    (acc, curr) =>
      acc +
      (hints.some((hint) => hint.id === curr.id && hint.type === curr.type)
        ? 1
        : 0),
    0,
  );

  const shareScore = async () => {
    setShareLoading(true);
    let uuid = '';

    if (gameType === 'daily' && daily) {
      const user = await getUser();
      if (user) {
        const [solution] = await sb_GetSolutions({
          user_id: user.id,
          daily_id: daily.id,
        });

        uuid = solution.id || '';
      }
    } else {
      uuid = await sb_PostSolutions({
        solution: history,
        hints,
        is_temporary: true,
      });
    }

    setShareLoading(false);

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
      <CSBackButton link={gameType === 'archive' ? '/daily/archive' : '/'} />
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
          <div className='success-buttons-container'>
            <div className='success-share-button'>
              <CSButton secondary onClick={shareScore} loading={shareLoading}>
                <ShareOutlined />
                Share
              </CSButton>
            </div>
            {gameType === 'daily' ? (
              <CSButton onClick={() => setStatsOpen(true)}>See Stats</CSButton>
            ) : gameType === 'archive' ? (
              <CSButton onClick={() => setStatsOpen(true)}>See Solutions</CSButton>
            ) : (
              <Link href='/custom'>
                <CSButton>New Game</CSButton>
              </Link>
            )}
          </div>
        </div>
        <CSCardTrack />
        {daily && statsOpen ? (
          <CSStatsModal
            isOpen={statsOpen}
            close={() => setStatsOpen(false)}
            daily={daily}
            solutions={solutions!}
            showStats={gameType === 'daily'}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
