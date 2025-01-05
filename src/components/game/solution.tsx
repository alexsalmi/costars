'use client';
import { getUserDailySolutions } from '@/services/userdata.service';
import CSBackButton from '../inputs/buttons/back-button';
import CardTrack from '../presentation/card-track';
import { useEffect, useState } from 'react';
import { getFormattedDateString } from '@/utils/utils';
import CSSpoilerAlertModal from '../modals/spoiler-alert-modal';

interface ISolutionProps {
  solution: Array<GameEntity>;
  hints: Array<Hint>;
  daily?: DailyCostars;
}

export default function Solution({ solution, hints, daily }: ISolutionProps) {
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    const solutions = getUserDailySolutions();

    const hasSolvedSolution =
      daily?.id !== undefined &&
      solutions.some((sol) => sol.daily_id === daily.id);

    setModalOpen(!hasSolvedSolution);
  }, []);

  return (
    <>
      <CSBackButton />
      <div className='solution-page-container'>
        {daily ? (
          <h3>
            Daily Costars #{daily.day_number} (
            {getFormattedDateString(daily.date)})
          </h3>
        ) : (
          <h3>
            {solution[0].label} to {solution[solution.length - 1].label}{' '}
          </h3>
        )}
        {!modalOpen ? <CardTrack cards={solution} hints={hints} /> : <></>}
      </div>
      <CSSpoilerAlertModal
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        daily={daily}
      />
    </>
  );
}
