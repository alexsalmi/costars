import { isYesterday } from "./utils.service";

const KEY_DAILY_STATS = 'costars-daily-stats';
const KEY_HIGHSCORE = 'costars-highscore';
const KEY_UNLIMITED_SAVE = 'costars-unimited-save';

export const getDailyStats = (): DailyStats => {
  if (typeof window !== 'undefined' && (window.localStorage.getItem(KEY_DAILY_STATS) !== null)){
    const stats = JSON.parse(atob(window.localStorage.getItem(KEY_DAILY_STATS)!)) as DailyStats;
    if(!stats.daysOptimal)
      stats.daysOptimal = 0;
    return stats;
  }

  return {
    daysPlayed: 0,
    currentStreak: 0,
    highestStreak: 0,
    daysOptimal: 0,
  }
}

export const updateDailyStats = (history: Array<GameEntity>) => {
  const dailyStats = getDailyStats();

  dailyStats.daysPlayed++;
  
  const score = (history.length - 1) / 2;
  if(score === 2)
    dailyStats.daysOptimal++;

  if (!dailyStats.lastPlayed || isYesterday(new Date(dailyStats.lastPlayed)))
    dailyStats.currentStreak++;
  else
    dailyStats.currentStreak = 1;

  if (dailyStats.currentStreak > dailyStats.highestStreak)
    dailyStats.highestStreak = dailyStats.currentStreak;

  dailyStats.lastPlayed = new Date().toString();

  dailyStats.lastSolve = history;


  window.localStorage.setItem(KEY_DAILY_STATS, btoa(JSON.stringify(dailyStats)));
}

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
