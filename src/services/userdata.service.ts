import localStorageService from './localstorage.service';
import {
  supabase_getUnlimitedStats,
  supabase_setUnlimitedStats,
  supabase_updateUnlimitedStats,
} from './supabase/supabase.service';
import { getTodaysCostars, getYesterdaysCostars } from './cache.service';
import supabaseService from '@/services/supabase';
import SupabaseService from '@/services/supabase';

export const getDailyStats = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    let dbStats = await SupabaseService.dailyStats.get({ user_id: user.id });

    if (!dbStats)
      dbStats = await SupabaseService.dailyStats.post({ user_id: user.id });

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

  if (dailyStats.last_played_id === yesterdaysCostars.id)
    dailyStats.current_streak = (dailyStats.current_streak || 0) + 1;
  else dailyStats.current_streak = 1;

  if (dailyStats.current_streak! > dailyStats.highest_streak!)
    dailyStats.highest_streak = dailyStats.current_streak;

  dailyStats.last_played = new Date().toUTCString();
  dailyStats.last_played_id = (await getTodaysCostars()).id;

  if (user) SupabaseService.dailyStats.update(dailyStats);

  localStorageService.setDailyStats(dailyStats);
};

export const saveSolution = async (
  user: UserInfo,
  solution: Array<GameEntity>,
  hints: Array<Hint>,
  dailyId?: number,
) => {
  if (user) {
    supabaseService.solutions.post({
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
    const dbStats = await supabase_getUnlimitedStats(user.id);
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

  if (user) supabase_updateUnlimitedStats(unlimitedStats);

  localStorageService.setUnlimitedStats(unlimitedStats);
};

export const getUserDailySolutions = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    const solutions = await supabaseService.solutions.get({
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
    SupabaseService.dailyStats.post({
      ...dailyStats,
      user_id: user?.id,
    }),
    supabase_setUnlimitedStats({
      ...unlimitedStats,
      user_id: user?.id,
    }),
    supabaseService.solutions.post(
      solutions.map((sol) => ({
        ...sol,
        user_id: user?.id,
      })),
    ),
  ]);
};
