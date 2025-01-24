import CSArchiveSkeleton from '@/components/skeletons/archive-skeleton';
import { Suspense } from 'react';
import ArchivePage from './archive-page';

export default async function Archive() {
  return (
    <Suspense fallback={<CSArchiveSkeleton />}>
      <ArchivePage />
    </Suspense>
  );
}

export const experimental_ppr = true;
