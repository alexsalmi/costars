import localStorageService from './localstorage.service';
import { getTodaysCostars, getYesterdaysCostars } from './cache.service';
import {
  sb_GetDailyStats,
  sb_GetSolutions,
  sb_GetUnlimitedStats,
  sb_PostDailyStats,
  sb_PostSolutions,
  sb_PostUnlimitedStats,
  sb_UpdateDailyStats,
  sb_UpdateUnlimitedStats,
} from './supabase';

export const getDailyStats = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    let dbStats = await sb_GetDailyStats({ user_id: user.id });

    if (!dbStats) dbStats = await sb_PostDailyStats({ user_id: user.id });

    localStorageService.setDailyStats(dbStats);
  }

  return localStorageService.getDailyStats();
};

export const updateDailyStats = async (
  user: UserInfo,
  solution: Array<GameEntity>,
  hints: Array<Hint>,
) => {
  const yesterdaysCostars = await getYesterdaysCostars();

  if (!yesterdaysCostars) return;

  const dailyStats: DailyStats = await getDailyStats(user);

  dailyStats.days_played!++;

  const score = solution.reduce(
    (acc, curr) => acc + (curr.type === 'movie' ? 1 : 0),
    0,
  );
  hints = hints.filter((hint) =>
    solution.some(
      (entity) => entity.id === hint.id && entity.type === hint.type,
    ),
  );
  if (score === 2 && hints.length === 0) dailyStats.optimal_solutions!++;

  if (dailyStats.last_played_id === yesterdaysCostars?.id)
    dailyStats.current_streak = (dailyStats.current_streak || 0) + 1;
  else dailyStats.current_streak = 1;

  if (dailyStats.current_streak! > dailyStats.highest_streak!)
    dailyStats.highest_streak = dailyStats.current_streak;

  dailyStats.last_played = new Date().toUTCString();
  dailyStats.last_played_id = (await getTodaysCostars())!.id;

  if (user) sb_UpdateDailyStats(dailyStats);

  localStorageService.setDailyStats(dailyStats);
};

export const saveSolution = async (
  user: UserInfo,
  solution: Array<GameEntity>,
  hints: Array<Hint>,
  dailyId?: number,
) => {
  if (user) {
    sb_PostSolutions({
      daily_id: dailyId,
      solution,
      hints,
      user_id: user.id,
    });
  }

  localStorageService.saveSolution({
    daily_id: dailyId,
    solution,
    hints,
  });
};

export const getUnlimitedStats = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    let dbStats = await sb_GetUnlimitedStats({
      user_id: user.id,
    });

    if (!dbStats) dbStats = await sb_PostUnlimitedStats({ user_id: user.id });

    localStorageService.setUnlimitedStats(dbStats);
  }

  return localStorageService.getUnlimitedStats();
};

export const updateUnlimitedStats = async (
  user: UserInfo,
  history: Array<GameEntity>,
  hints: Array<Hint>,
) => {
  const unlimitedStats = await getUnlimitedStats(user);

  if (history.length > unlimitedStats.high_score!)
    unlimitedStats.high_score = history.length;

  unlimitedStats.history = history;
  unlimitedStats.hints = hints;

  if (user) sb_UpdateUnlimitedStats(unlimitedStats);

  localStorageService.setUnlimitedStats(unlimitedStats);
};

export const getUserDailySolutions = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    const solutions = await sb_GetSolutions({
      user_id: user.id,
      all_daily: true,
    });
    localStorageService.setSolutions(solutions);
  }

  return localStorageService.getSolutions();
};

export const migrateSaveDate = async (user: UserInfo) => {
  const dailyStats = localStorageService.getDailyStats();
  const unlimitedStats = localStorageService.getUnlimitedStats();
  const solutions = localStorageService.getSolutions();

  return await Promise.all([
    sb_PostDailyStats({
      ...dailyStats,
      user_id: user?.id,
    }),
    sb_PostUnlimitedStats({
      ...unlimitedStats,
      user_id: user?.id,
    }),
    sb_PostSolutions(
      solutions.map((sol) => ({
        ...sol,
        user_id: user?.id,
      })),
    ),
  ]);
};
