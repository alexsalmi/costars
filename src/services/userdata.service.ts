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
import {
  ls_DeleteFreshStatus,
  ls_GetDailyStats,
  ls_GetSolutions,
  ls_GetUnlimitedStats,
  ls_HasDailyStats,
  ls_HasUnlimitedStats,
  ls_PostDailyStats,
  ls_PostFreshStatus,
  ls_PostSolutions,
  ls_PostUnlimitedStats,
} from './localstorage';
import { getUser } from './supabase/auth.service';

/* ----- DAILY STATS ----- */
export const getDailyStats = (): DailyStats => {
  if (!ls_HasDailyStats()) {
    ls_PostFreshStatus();
    ls_PostDailyStats({
      days_played: 0,
      current_streak: 0,
      highest_streak: 0,
      optimal_solutions: 0,
    });
  }

  return ls_GetDailyStats()!;
};

export const updateDailyStats = (
  user: UserInfo,
  solution: Array<GameEntity>,
  hints: Array<Hint>,
  day_number: number,
) => {
  const dailyStats: DailyStats = getDailyStats();

  // Update days played
  dailyStats.days_played!++;

  // Update optimal solutions
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

  // Update current streak
  if (dailyStats.last_played === day_number - 1)
    dailyStats.current_streak = (dailyStats.current_streak || 0) + 1;
  else dailyStats.current_streak = 1;

  // Update highest streak
  if (dailyStats.current_streak! > dailyStats.highest_streak!)
    dailyStats.highest_streak = dailyStats.current_streak;

  // Updated last played data
  dailyStats.last_played = day_number;

  if (user) sb_UpdateDailyStats(dailyStats);

  ls_PostDailyStats(dailyStats);
  ls_DeleteFreshStatus();
};
/* ----- END OF DAILY STATS ----- */

/* ----- UNLIMITED STATS ----- */
export const getUnlimitedStats = (): UnlimitedStats => {
  if (!ls_HasUnlimitedStats()) {
    ls_PostFreshStatus();
    ls_PostUnlimitedStats({
      history: [],
      hints: [],
      high_score: 0,
    });
  }

  return ls_GetUnlimitedStats()!;
};

export const updateUnlimitedStats = (
  user: UserInfo,
  history: Array<GameEntity>,
  hints: Array<Hint>,
) => {
  const unlimitedStats = getUnlimitedStats();

  if (history.length > unlimitedStats.high_score!)
    unlimitedStats.high_score = history.length;

  unlimitedStats.history = history;
  unlimitedStats.hints = hints;

  if (user) sb_UpdateUnlimitedStats(unlimitedStats);

  ls_PostUnlimitedStats(unlimitedStats);
  ls_DeleteFreshStatus();
};
/* ----- END OF UNLIMITED STATS ----- */

/* ----- SOLUTIONS ----- */
export const getUserDailySolutions = () => {
  return ls_GetSolutions();
};

export const postSolution = (
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

  ls_PostSolutions({
    daily_id: dailyId,
    solution,
    hints,
  });
  ls_DeleteFreshStatus();
};
/* ----- END OF SOLUTIONS ----- */

/* ----- DATA MIGRATION ----- */
export const syncUserData = async () => {
  const user = await getUser();

  if (!user) return;

  const ls_dailyStats = ls_GetDailyStats();
  const ls_unlimitedStats = ls_GetUnlimitedStats();

  const dailyStatsPromise = sb_GetDailyStats({ user_id: user.id });
  const unlimitedStatsPromise = sb_GetUnlimitedStats({ user_id: user.id });

  const [sb_dailyStats, sb_unlimitedStats] = await Promise.all([
    dailyStatsPromise,
    unlimitedStatsPromise,
  ]);

  if (
    ls_dailyStats?.updated_at === sb_dailyStats?.updated_at &&
    ls_unlimitedStats?.updated_at === sb_unlimitedStats?.updated_at
  ) {
    return;
  }

  ls_PostDailyStats(sb_dailyStats!);
  ls_PostUnlimitedStats(sb_unlimitedStats!);

  await sb_GetSolutions({
    user_id: user.id,
    all_daily: true,
  }).then((solutions) => {
    ls_PostSolutions(solutions);
  });

  window.location.reload();
};

export const migrateFromLStoSB = async () => {
  const user = await getUser();

  if (!user) throw Error('No active user session');

  const dailyStats = ls_GetDailyStats();
  const unlimitedStats = ls_GetUnlimitedStats();
  const solutions = ls_GetSolutions();

  return await Promise.all([
    sb_PostDailyStats({
      ...dailyStats,
      user_id: user.id,
    }),
    sb_PostUnlimitedStats({
      ...unlimitedStats,
      user_id: user.id,
    }),
    sb_PostSolutions(
      solutions.map((sol) => ({
        ...sol,
        user_id: user.id,
      })),
    ),
  ]);
};

export const migrateFromSBToLS = async () => {
  const user = await getUser();

  if (!user) throw Error('No active user session');

  const dailyStatsPromise = sb_GetDailyStats({ user_id: user.id })
    .then(async (stats) => {
      if (!stats) stats = await sb_PostDailyStats({ user_id: user.id });
      return stats;
    })
    .then((stats) => {
      ls_PostDailyStats(stats);
    });

  const unlimitedStatsPromise = sb_GetUnlimitedStats({ user_id: user.id })
    .then(async (stats) => {
      if (!stats) stats = await sb_PostUnlimitedStats({ user_id: user.id });
      return stats;
    })
    .then((stats) => {
      ls_PostUnlimitedStats(stats);
    });

  const solutionsPromise = sb_GetSolutions({
    user_id: user.id,
    all_daily: true,
  }).then((solutions) => {
    ls_PostSolutions(solutions);
  });

  await Promise.all([
    dailyStatsPromise,
    unlimitedStatsPromise,
    solutionsPromise,
  ]);

  ls_DeleteFreshStatus();

  return;
};
/* ----- END OF DATA MIGRATION ----- */
