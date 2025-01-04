const KEY_DAILY_STATS = 'cs-daily-stats';

export const lsGetDailyStats = (): DailyStats | null => {
  if (!lsHasDailyStats()) return null;

  const stats = JSON.parse(
    atob(window.localStorage.getItem(KEY_DAILY_STATS)!),
  ) as DailyStats;

  return stats;
};

export const lsPostDailyStats = (dailyStats: DailyStats) => {
  window.localStorage.setItem(
    KEY_DAILY_STATS,
    btoa(JSON.stringify(dailyStats)),
  );
};

export const lsDeleteDailyStats = () => {
  window.localStorage.removeItem(KEY_DAILY_STATS);
};

export const lsHasDailyStats = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.getItem(KEY_DAILY_STATS) !== null
  );
};
