'use client';
import CSModal from './modal';
import useCostarsState from '@/store/costars.state';
import CSTextDisplay from '../presentation/display';
import CSCardTrack from '../presentation/card-track';
import CSSolutionsToolbar from '../inputs/toolbars/solutions-toolbar';
import { useState } from 'react';
import CSButton from '../inputs/buttons/button';
import Link from 'next/link';
import { CalendarMonthOutlined } from '@mui/icons-material';
import '@/styles/modals/stats-modal.scss';

interface ICSStatsModalProps {
  isOpen: boolean;
  close: () => void;
  daily: DailyCostars;
  solutions: Array<Solution>;
  showStats: boolean;
}

export default function CSStatsModal({
  isOpen,
  close,
  daily,
  solutions,
  showStats
}: ICSStatsModalProps) {
  const { score, history, hints, dailyStats, gameType } = useCostarsState();
  const [solutionInd, setSolutionInd] = useState(0);

  const numMovies = (score - 1) / 2;
  const numHints = history.reduce(
    (acc, curr) =>
      acc +
      (hints.some((hint) => hint.id === curr.id && hint.type === curr.type)
        ? 1
        : 0),
    0,
  );

  const getFormattedDateString = (dateStr: string) => {
    const date = new Date(dateStr);

    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear() !== new Date().getFullYear() ? date.getFullYear() : ''}`

  }

  return (
    <CSModal isOpen={isOpen} close={close}>
      <div className='stats-modal-container'>
        <div className='stats-modal-recap'>
          <h3>Daily Costars #{daily.day_number}</h3>
          { gameType === 'daily' ? 
            <span>You connected today&apos;s costars in</span>
          :
            <span>You connected the {getFormattedDateString(daily.date)} costars in</span>
          }
          <span>
            <strong>{numMovies} movies</strong>
            {numHints > 0 ? (
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint.' : 'hints.'}
                </strong>
              </>
            ) : (
              <span>.</span>
            )}
          </span>
          {numMovies === 2 && numHints === 0 ? (
            <strong>{"That's"} a perfect game!</strong>
          ) : (
            <></>
          )}
        </div>
        {showStats ? 
          <div className='stats-modal-stats'>
            <CSTextDisplay>
              <span>{dailyStats?.days_played}</span>
              <span>Days Played</span>
            </CSTextDisplay>
            <CSTextDisplay>
              <span>
                {dailyStats
                  ? Math.round(
                      (dailyStats!.optimal_solutions! /
                        dailyStats!.days_played!) *
                        100,
                    )
                  : 0}
                %
              </span>
              <span>Percent Optimal</span>
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
        : <></> }
        <Link href='/daily/archive' className='stats-modal-archive-button'>
          <CSButton>
            <CalendarMonthOutlined />
            Explore the Daily Archive
          </CSButton>
        </Link>
        <hr />
        <div className='stats-modal-optimal'>
          Here are a few of the{' '}
          <strong>{daily.num_solutions} different ways</strong> to connect{' '}
          <strong>{daily.starter.label}</strong> and{' '}
          <strong>{daily.target.label}</strong> in 2 movies:
        </div>
        <div className='stats-modal-solutions'>
          <CSSolutionsToolbar
            leftClick={() => setSolutionInd(solutionInd - 1)}
            rightClick={() => setSolutionInd(solutionInd + 1)}
            leftDisabled={solutionInd === 0}
            rightDisabled={solutionInd === (solutions.length || 1) - 1}
          />
          <CSCardTrack
            cards={solutions[solutionInd].solution}
            hideHints={true}
            fullHeight={true}
          />
        </div>
      </div>
    </CSModal>
  );
}
