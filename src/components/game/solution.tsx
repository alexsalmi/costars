'use client';
import { getUserDailySolutions } from '@/services/userdata.service';
import CSBackButton from '../inputs/buttons/back-button';
import CardTrack from '../presentation/card-track';
import { useEffect, useState } from 'react';
import { getDayNumber, getFormattedDateString } from '@/utils/utils';
import CSSpoilerAlertModal from '../modals/spoiler-alert-modal';

interface ISolutionProps {
  solution: Array<GameEntity>;
  hints: Array<Hint>;
  daily?: DailyCostars;
}

export default function Solution({ solution, hints, daily }: ISolutionProps) {
  const [initializing, setInitializing] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isToday =
    (daily &&
      daily.day_number ===
        getDayNumber(
          new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
        )) ||
    false;

  useEffect(() => {
    const solutions = getUserDailySolutions();

    const hasSolvedSolution =
      daily?.id === undefined ||
      solutions.some((sol) => sol.daily_id === daily.id);

    setModalOpen(!hasSolvedSolution);
    setInitializing(false);
  }, []);

  return (
    <>
      <CSBackButton link='/' />
      <div className='solution-page-container'>
        {daily && isToday ? (
          <h3>Daily Costars #{daily.day_number} (today)</h3>
        ) : daily ? (
          <h3>
            Daily Costars #{daily.day_number} (
            {getFormattedDateString(daily.date)})
          </h3>
        ) : (
          <h3>
            {solution[0].label} to {solution[solution.length - 1].label}{' '}
          </h3>
        )}
        <CardTrack
          cards={initializing || modalOpen ? [] : solution}
          hints={hints}
          shimmer={initializing}
        />
      </div>
      <CSSpoilerAlertModal
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        daily={daily}
        isToday={isToday}
      />
    </>
  );
}
