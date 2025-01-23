import { Suspense } from 'react';
import DailyArchiveGame from './archive-game';
import CSGameContainerSkeleton from '@/components/skeletons/game-container-skeleton';
interface IDailyArchiveGameProps {
  params: Promise<{ day_number: string }>;
}

export default async function DailyArchivePage({
  params,
}: IDailyArchiveGameProps) {
  return (
    <Suspense fallback={<CSGameContainerSkeleton />}>
      <DailyArchiveGame params={params} />
    </Suspense>
  );
}

export const experimental_ppr = true;
