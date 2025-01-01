import { signOut } from '@/services/supabase/auth.service';
import localStorageService from '@/services/localstorage.service';
import { ls_GetFreshStatus } from '@/services/localstorage';

export function getDayNumber(date: string) {
  return Math.floor(
    (new Date(date).getTime() - new Date('12/31/2024').getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function getScoreString(history: Array<GameEntity>, hints: Array<Hint>) {
  let str = '';

  for (const entity of history) {
    if (entity.type === 'movie') str += '🎬';

    if (
      hints.some((hint) => hint.id === entity.id && hint.type === entity.type)
    )
      str += '❓';
  }

  return str;
}

export async function warnForConflict() {
  const res = confirm(
    'WARNING:\nYour local save data will be overwritten if you sign into this existing account. Continue anyway?',
  );

  if (!res) {
    const error = await signOut();

    if (!error) {
      localStorageService.setAuthStatus('false');
      window.location.reload();
    }
  }

  return;
}

export function isFresh() {
  return typeof window !== 'undefined' && ls_GetFreshStatus();
}
