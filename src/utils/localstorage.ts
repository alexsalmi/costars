import {
  ls_DeleteDailySave,
  ls_DeleteDailyStats,
  ls_DeleteSolutions,
  ls_DeleteUnlimitedStats,
  ls_GetAuthStatus,
  ls_GetFreshStatus,
} from '@/services/localstorage';

export function isFresh() {
  return typeof window !== 'undefined' && ls_GetFreshStatus();
}

export function clearStorage() {
  ls_DeleteDailyStats();
  ls_DeleteUnlimitedStats();
  ls_DeleteSolutions();
  ls_DeleteDailySave();
}

export function isMigrationPending() {
  return ls_GetAuthStatus() === 'pending';
}
