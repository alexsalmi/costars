import { Suspense } from 'react';
import DailyGame from './daily-game';
import CSGameContainerSkeleton from '@/components/skeletons/game-container-skeleton';

export default async function DailyPage() {
  return (
    <Suspense fallback={<CSGameContainerSkeleton />}>
      <DailyGame />
    </Suspense>
  );
}

export const experimental_ppr = true;
