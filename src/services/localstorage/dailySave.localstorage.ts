const KEY_DAILY_SAVE = 'cs-daily-save';

export const lsGetDailySave = (): Solution | null => {
  if (!lsHasDailySave()) return null;

  const stats = JSON.parse(
    atob(window.localStorage.getItem(KEY_DAILY_SAVE)!),
  ) as Solution;

  return stats;
};

export const lsPostDailySave = (dailySave: Solution) => {
  window.localStorage.setItem(KEY_DAILY_SAVE, btoa(JSON.stringify(dailySave)));
};

export const lsDeleteDailySave = () => {
  window.localStorage.removeItem(KEY_DAILY_SAVE);
};

export const lsHasDailySave = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.getItem(KEY_DAILY_SAVE) !== null
  );
};
