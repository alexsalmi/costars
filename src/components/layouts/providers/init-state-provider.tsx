'use client';

import { syncUserData } from '@/services/userdata.service';
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
    syncUserData();
  }, []);

  return <>{children}</>;
}
