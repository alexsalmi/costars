'use client';
import Link from 'next/link';
import CSButton from '../inputs/buttons/button';
import { getScoreString } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { getUserDailySolutions } from '@/services/userdata.service';
import '@/styles/presentation/daily-costars.scss';
import CSEntityImage from './entity-image';

interface ICSDailyCostarsProps {
  daily?: DailyCostars;
}

export default function CSDailyCostars({ daily }: ICSDailyCostarsProps) {
  const [solution, setSolution] = useState<Solution | null>(null);

  useEffect(() => {
    const userDailySolutions = getUserDailySolutions();

    const solution = userDailySolutions.find(
      (sol) => sol.daily_id === daily?.id,
    );

    setSolution(solution || null);
  }, [daily]);

  return (
    <div className='daily-costars-container'>
      <h3 className='daily-costars-header'>Daily Costars</h3>
      <div className='daily-costars-previews'>
        <CSEntityImage entity={daily?.starter} />
        <div className='daily-costars-names'>
          <span>{daily?.starter.label}</span>
          <span>to</span>
          <span>{daily?.target.label}</span>
        </div>
        <CSEntityImage entity={daily?.target} />
      </div>
      <Link href='/daily'>
        <CSButton>
          {solution
            ? getScoreString(solution.solution, solution.hints!)
            : 'Play!'}
        </CSButton>
      </Link>
    </div>
  );
}
