'use client';
import { getUserDailySolutions } from '@/services/userdata.service';
import Link from 'next/link';
import CSButton from './button';
import { getScoreString } from '@/utils/utils';
import { useRef } from 'react';

interface ICSPlayButtonProps {
  daily: DailyCostars;
}

export default function CSPlayButton({ daily }: ICSPlayButtonProps) {
  const userDailySolutions = useRef(getUserDailySolutions());

  const solution = userDailySolutions.current.find(
    (sol) => sol.daily_id === daily?.id,
  );

  return (
    <Link href='/daily'>
      <CSButton>
        {solution
          ? getScoreString(solution.solution, solution.hints!)
          : 'Play!'}
      </CSButton>
    </Link>
  );
}
