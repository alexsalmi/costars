import localStorageService from "./localstorage.service";
import { supabase_getDailyStats, supabase_getUnlimitedStats, supabase_getUserDailySolutions, supabase_saveSolution, supabase_updateDailyStats, supabase_updateUnlimitedStats } from "./supabase.service";
import { getTodaysCostars, getYesterdaysCostars } from "./cache.service";

export const getDailyStats = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    const dbStats = await supabase_getDailyStats(user.id);
    localStorageService.setDailyStats(dbStats);
  }
  
  return localStorageService.getDailyStats();
}

export const updateDailyStats = async (user: UserInfo, solution: Array<GameEntity>, hints: Array<Hint>) => {
  const todaysCostars = await getTodaysCostars();
  const yesterdaysCostars = await getYesterdaysCostars();

  const dailyStats: DailyStats = await getDailyStats(user);
  const solutions: Array<Solution> = await getUserDailySolutions(user);
  
  const lastSolution = solutions[solutions.length - 1];

  dailyStats.days_played!++;
  
  const score = solution.reduce((acc, curr) => acc + (curr.type === 'movie' ? 1 : 0), 0);
  hints = hints.filter(hint => solution.some(entity => entity.id === hint.id && entity.type === hint.type));
  if(score === 2 && hints.length === 0)
    dailyStats.optimal_solutions!++;

  if (!lastSolution || lastSolution.daily_id === yesterdaysCostars.id)
    dailyStats.current_streak!++;
  else
    dailyStats.current_streak = 1;

  if (dailyStats.current_streak! > dailyStats.highest_streak!)
    dailyStats.highest_streak = dailyStats.current_streak;

  dailyStats.last_played = new Date().toUTCString();
  dailyStats.last_played_id = (await getTodaysCostars()).id;

  if (user) {
    supabase_updateDailyStats(dailyStats);
    supabase_saveSolution({
      daily_id: todaysCostars.id,
      solution,
      hints,
      user_id: user.id
    });
  }

  localStorageService.setDailyStats(dailyStats);
  localStorageService.saveSolution({
    daily_id: todaysCostars.id,
    solution,
    hints
  });
}

export const getUnlimitedStats = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    const dbStats = await supabase_getUnlimitedStats(user.id);
    localStorageService.setUnlimitedStats(dbStats);
  }
  
  return localStorageService.getUnlimitedStats();
}

export const updateUnlimitedStats = async (user: UserInfo, history: Array<GameEntity>, hints: Array<Hint>) => {
  const unlimitedStats = await getUnlimitedStats(user);

  if (history.length > unlimitedStats.high_score!)
    unlimitedStats.high_score = history.length;

  unlimitedStats.history = history;
  unlimitedStats.hints = hints;

  if (user)
    supabase_updateUnlimitedStats(unlimitedStats);

  localStorageService.setUnlimitedStats(unlimitedStats);
}

export const getUserDailySolutions = async (user: UserInfo) => {
  if (user && localStorageService.getAuthStatus() === 'pending') {
    const solutions = await supabase_getUserDailySolutions(user.id);
    localStorageService.setSolutions(solutions);
  }
  
  return localStorageService.getSolutions();
}

export const migrateSaveDate = async () => {
  const dailyStats = localStorageService.getDailyStats();
  const unlimitedStats = localStorageService.getUnlimitedStats();
  const solutions = localStorageService.getSolutions();

  await Promise.all([
    supabase_updateDailyStats(dailyStats),
    supabase_updateUnlimitedStats(unlimitedStats),
    supabase_saveSolution(solutions)
  ]);

  return;
}