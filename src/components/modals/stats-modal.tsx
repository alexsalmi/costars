'use client';
import CSModal from './modal';
import useCostarsState from '@/store/costars.state';
import CSTextDisplay from '../presentation/display';
import CSCardTrack from '../presentation/card-track';
import { Dispatch, SetStateAction, useState } from 'react';
import CSButton from '../inputs/buttons/button';
import Link from 'next/link';
import { CalendarMonthOutlined, ShareOutlined } from '@mui/icons-material';
import '@/styles/modals/stats-modal.scss';
import { getFormattedDateString } from '@/utils/utils';
import { getUserDailySolutions } from '@/services/userdata.service';

interface ICSStatsModalProps {
  isOpen: boolean;
  close: () => void;
  daily: DailyCostars;
  solutions: Array<Solution>;
  showStats: boolean;
  shareFn: (loadingFn?: Dispatch<SetStateAction<boolean>>) => Promise<void>;
}

export default function CSStatsModal({
  isOpen,
  close,
  daily,
  solutions,
  showStats,
  shareFn,
}: ICSStatsModalProps) {
  const { score, history, hints, dailyStats, gameType } = useCostarsState();
  const [shareLoading, setShareLoading] = useState(false);

  const userDailySolutions = getUserDailySolutions();
  const numMovies = (score - 1) / 2;
  const numHints = history.reduce(
    (acc, curr) =>
      acc +
      (hints.some((hint) => hint.id === curr.id && hint.type === curr.type)
        ? 1
        : 0),
    0,
  );
  const average = (
    userDailySolutions.reduce(
      (acc, curr) =>
        acc +
        curr.solution.reduce(
          (acc, currSol) => acc + (currSol.type === 'movie' ? 1 : 0),
          0,
        ) +
        (curr.hints?.reduce(
          (acc, currHint) =>
            acc +
            (curr.solution.some(
              (entity) =>
                entity.type === currHint.type && entity.id === currHint.id,
            )
              ? 0.5
              : 0),
          0,
        ) || 0),
      0,
    ) / userDailySolutions.length
  ).toPrecision(3);

  return (
    <CSModal isOpen={isOpen} close={close}>
      <div className='stats-modal-container'>
        <div className='stats-modal-recap'>
          <h3>Daily Costars #{daily.day_number}</h3>
          <span>
            {gameType === 'daily'
              ? 'You connected today&apos;s costars in '
              : `You connected the ${getFormattedDateString(daily.date)} costars in `}
            <strong>{numMovies} movies</strong>
            {numHints > 0 ? (
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint.' : 'hints.'}
                </strong>
              </>
            ) : (
              '.'
            )}
          </span>
          {numMovies === 2 && numHints === 0 ? (
            <strong>{"That's"} a perfect game!</strong>
          ) : (
            <></>
          )}
        </div>
        {showStats ? (
          <div className='stats-modal-stats'>
            <CSTextDisplay>
              <span>{dailyStats?.days_played}</span>
              <span>Days Played</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{average}</span>
              <span>Average Score</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{dailyStats?.optimal_solutions}</span>
              <span>Perfect Games</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{dailyStats?.current_streak}</span>
              <span>Current Streak</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>{dailyStats?.highest_streak}</span>
              <span>Highest Streak</span>
            </CSTextDisplay>
          </div>
        ) : (
          <></>
        )}
        <Link href='/daily/archive' className='stats-modal-archive-button'>
          <CSButton>
            <CalendarMonthOutlined />
            Explore the Daily Archive
          </CSButton>
        </Link>
        <div className='stats-modal-share-button'>
          <CSButton
            secondary
            onClick={() => shareFn(setShareLoading)}
            loading={shareLoading}
          >
            <ShareOutlined />
            Share
          </CSButton>
        </div>
        <hr />
        <div className='stats-modal-optimal'>
          <span>
            Here are a few of the{' '}
            <strong>{daily.num_solutions} different ways</strong> to connect{' '}
            <strong>{daily.starter.label}</strong> and{' '}
            <strong>{daily.target.label}</strong> in 2 movies:
          </span>
          <CSCardTrack
            carouselCards={solutions.map((sol) => sol.solution)}
            fullHeight
          />
        </div>
      </div>
    </CSModal>
  );
}
