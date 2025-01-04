import {
  ls_DeleteDailyStats,
  ls_DeleteSolutions,
  ls_DeleteUnlimitedStats,
  ls_GetAuthStatus,
  ls_GetFreshStatus,
  ls_PostAuthStatus,
} from '@/services/localstorage';
import { signOut } from '@/services/supabase/auth.service';

export async function warnForConflict() {
  const res = confirm(
    'WARNING:\nYour local save data will be overwritten if you sign into this existing account. Continue anyway?',
  );

  if (!res) {
    const error = await signOut();

    if (!error) {
      ls_PostAuthStatus('false');
      window.location.reload();
    }
  }

  return;
}

export function isFresh() {
  return typeof window !== 'undefined' && ls_GetFreshStatus();
}

export function clearStorage() {
  ls_DeleteDailyStats();
  ls_DeleteUnlimitedStats();
  ls_DeleteSolutions();
}

export function isMigrationPending() {
  return ls_GetAuthStatus() === 'pending';
}
