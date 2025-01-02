'use client';
import '@/styles/pages/migration.scss';
import { useEffect } from 'react';
import { ls_PostAuthStatus } from '@/services/localstorage';
import { redirect } from 'next/navigation';
import {
  migrateFromLStoSB,
  migrateFromSBToLS,
} from '@/services/userdata.service';
import useCostarsState from '@/store/costars.state';
import { CircularProgress } from '@mui/material';
import {
  isFresh,
  isMigrationPending,
  warnForConflict,
} from '@/utils/localstorage';
import { sb_GetDailyStats } from '@/services/supabase';

export default function Migration() {
  const { bootstrapUserState } = useCostarsState();

  useEffect(() => {
    if (!isMigrationPending()) redirect('/');

    let keepLocal = false;
    let authConflict = false;

    // If there is non-fresh data in localstorage, we need to check for conflicts
    if (!isFresh()) {
      sb_GetDailyStats({}).then(async (res) => {
        const hasStatsInDB = res !== null;
        keepLocal = !hasStatsInDB;
        authConflict = hasStatsInDB;

        if (authConflict) await warnForConflict();

        if (keepLocal) migrateFromLStoSB().then(finalize);
        else migrateFromSBToLS().then(finalize);
      });
    } else {
      migrateFromSBToLS().then(finalize);
    }
  }, []);

  const finalize = () => {
    ls_PostAuthStatus('true');
    bootstrapUserState();
    redirect('/');
  };

  return (
    <div className='migration-page'>
      <CircularProgress size={50} />
    </div>
  );
}
