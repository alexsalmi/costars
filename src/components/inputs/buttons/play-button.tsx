'use client';
import { getUserDailySolutions } from '@/services/userdata.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CSButton from './button';
import { getScoreString } from '@/utils/utils';

interface ICSPlayButtonProps {
  daily: DailyCostars;
}

export default function CSPlayButton({ daily }: ICSPlayButtonProps) {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const userDailySolutions = getUserDailySolutions();

    const solution = userDailySolutions.find(
      (sol) => sol.daily_id === daily?.id,
    );

    setSolution(solution || null);
    setInitializing(false);
  }, [daily]);

  return (
    <Link href='/daily'>
      <CSButton>
        {!initializing && solution
          ? getScoreString(solution.solution, solution.hints!)
          : 'Play!'}
      </CSButton>
    </Link>
  );
}
