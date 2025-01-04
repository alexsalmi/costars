const KEY_UNLIMITED_STATS = 'cs-unlimited-stats';

export const lsGetUnlimitedStats = (): UnlimitedStats | null => {
  if (!lsHasUnlimitedStats()) return null;

  const stats = JSON.parse(
    atob(window.localStorage.getItem(KEY_UNLIMITED_STATS)!),
  ) as UnlimitedStats;

  return stats;
};

export const lsPostUnlimitedStats = (unlimitedStats: UnlimitedStats) => {
  window.localStorage.setItem(
    KEY_UNLIMITED_STATS,
    btoa(JSON.stringify(unlimitedStats)),
  );
};

export const lsDeleteUnlimitedStats = () => {
  window.localStorage.removeItem(KEY_UNLIMITED_STATS);
};

export const lsHasUnlimitedStats = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.getItem(KEY_UNLIMITED_STATS) !== null
  );
};
