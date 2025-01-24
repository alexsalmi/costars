import CSSolutionSkeleton from '@/components/skeletons/solution-skeleton';
import { Suspense } from 'react';
import SolutionPage from './solution-page';

interface ISolutionProps {
  params: Promise<{ uuid: string }>;
}

export default async function Solution({ params }: ISolutionProps) {
  return (
    <Suspense fallback={<CSSolutionSkeleton />}>
      <SolutionPage params={params} />
    </Suspense>
  );
}
