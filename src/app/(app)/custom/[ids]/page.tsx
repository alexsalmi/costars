import { Suspense } from 'react';
import CustomGame from './custom-game';
import CSGameContainerSkeleton from '@/components/skeletons/game-container-skeleton';

interface ICustomGameProps {
  params: Promise<{ ids: string }>;
}

export default async function CustomGamePage({ params }: ICustomGameProps) {
  return (
    <Suspense fallback={<CSGameContainerSkeleton />}>
      <CustomGame params={params} />
    </Suspense>
  );
}
