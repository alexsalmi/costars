'use client';
import Image from 'next/image';
import Link from 'next/link';
import CSButton from '../inputs/buttons/button';
import { getScoreString } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { getUserDailySolutions } from '@/services/userdata.service';
import '@/styles/presentation/daily-costars.scss';

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
        <Image
          priority
          src={
            daily?.starter.image
              ? `https://image.tmdb.org/t/p/w185${daily?.starter.image}`
              : '/placeholder.webp'
          }
          width={80}
          height={120}
          alt={`Image of ${daily?.starter.label}`}
        />
        <div className='daily-costars-names'>
          <span>{daily?.starter.label}</span>
          <span>and</span>
          <span>{daily?.target.label}</span>
        </div>
        <Image
          priority
          src={
            daily?.starter.image
              ? `https://image.tmdb.org/t/p/w185${daily?.target.image}`
              : '/placeholder.webp'
          }
          width={80}
          height={120}
          alt={`Image of ${daily?.target.label}`}
        />
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
