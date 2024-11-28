const KEY_HIGHSCORE = 'costars-highscore';
const KEY_UNLIMITED_SAVE = 'costars-unimited-save';

export const getHighscore = () => {
  return parseInt(typeof window !== 'undefined' ?
    window.localStorage.getItem(KEY_HIGHSCORE) || '0'
    : '0')
}

export const incrementHighscore = () => {
  const highScore = getHighscore();

  window.localStorage.setItem(KEY_HIGHSCORE, (highScore + 1).toString());
}

export const getUnlimitedSave = () => {
  if (typeof window !== 'undefined' && (window.localStorage.getItem(KEY_UNLIMITED_SAVE) !== null))
    return JSON.parse(atob(window.localStorage.getItem(KEY_UNLIMITED_SAVE)!));
  
  return [];
}

export const updateUnlimitedSave = (history: Array<GameEntity>) => {
  window.localStorage.setItem(KEY_UNLIMITED_SAVE, btoa(JSON.stringify(history)));
}
