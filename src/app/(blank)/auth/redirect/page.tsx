'use client';
import '@/styles/pages/auth-redirect.scss';
import { useEffect, useState } from 'react';
import { ls_PostAuthStatus } from '@/services/localstorage';
import { redirect } from 'next/navigation';
import {
  migrateFromLStoSB,
  migrateFromSBToLS,
} from '@/services/userdata.service';
import useCostarsState from '@/store/costars.state';
import { isFresh, isMigrationPending } from '@/utils/localstorage';
import { sb_GetDailyStats } from '@/services/supabase';
import CSSaveConflictModal from '@/components/modals/save-conflict-modal';
import { signOut } from '@/services/supabase/auth.service';
import Image from 'next/image';
import logo from '@/../public/costars_primary_logo.png';

export default function AuthRedirect() {
  const { bootstrapUserState } = useCostarsState();
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (!isMigrationPending()) redirect('/');

    let authConflict = false;

    // If there is non-fresh data in localstorage, we need to check for conflicts
    if (!isFresh()) {
      sb_GetDailyStats({}).then(async (res) => {
        const hasStatsInDB = res !== null;
        authConflict = hasStatsInDB;

        if (authConflict) setConflict(true);
        else migrateFromLStoSB().then(finalize);
      });
    } else {
      migrateFromSBToLS().then(finalize);
    }
  }, []);

  const handleConflictOk = () => {
    setConflict(false);
    migrateFromSBToLS().then(finalize);
  };

  const handleConflictCancel = async () => {
    setConflict(false);
    const error = await signOut();

    if (!error) {
      ls_PostAuthStatus('false');
      window.location.reload();
    }
  };

  const finalize = () => {
    ls_PostAuthStatus('true');
    bootstrapUserState();
    redirect('/');
  };

  return (
    <div className='auth-redirect-page'>
      {!conflict && (
        <Image priority src={logo} alt='Costars logo' height={80} />
      )}
      <CSSaveConflictModal
        isOpen={conflict}
        handleOk={handleConflictOk}
        handleCancel={handleConflictCancel}
      />
    </div>
  );
}
