'use client';

import useCostarsState from '@/store/costars.state';
import { isMigrationPending } from '@/utils/localstorage';
import { useEffect } from 'react';

export default function InitStateProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { bootstrapUserState } = useCostarsState();

  useEffect(() => {
    if (isMigrationPending()) return;

    bootstrapUserState();
  }, []);

  return <>{children}</>;
}
