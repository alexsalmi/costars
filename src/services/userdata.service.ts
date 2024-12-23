import { getUserFromClient } from "@/utils/utils"
import localStorageService from "./localstorage.service";
import { supabase_getDailyCostars, supabase_getDailyStats, supabase_getUnlimitedStats, supabase_getUserDailySolutions, supabase_saveSolution, supabase_updateDailyStats, supabase_updateUnlimitedStats } from "./supabase.service";
import { getTodaysCostars } from "./cache.service";

export const getDailyStats = async () => {
  const user = await getUserFromClient();

  if (!user)
    return localStorageService.getDailyStats();
  
  return await supabase_getDailyStats(user.id);
}

export const updateDailyStats = async (solution: Array<GameEntity>, hints: Array<Hint>) => {
  const user = await getUserFromClient();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() + 1);
  const todaysCostars = await supabase_getDailyCostars(new Date());
  const yesterdaysCostars = await supabase_getDailyCostars(yesterday);

  let dailyStats: DailyStats;
  let solutions: Array<Solution>;
  if (!user) {
    dailyStats = localStorageService.getDailyStats();
    solutions = localStorageService.getSolutions();
  }
  else {
    dailyStats = await supabase_getDailyStats(user.id);
    solutions = await supabase_getUserDailySolutions(user.id);
  }
  
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

  dailyStats.last_played = new Date().toISOString();
  dailyStats.last_played_id = (await getTodaysCostars()).id;

  if (!user) {
    localStorageService.updateDailyStats(dailyStats);
    localStorageService.saveSolution({
      daily_id: todaysCostars.id,
      solution,
      hints
    });
  }
  else {
    supabase_updateDailyStats(dailyStats);
    supabase_saveSolution({
      daily_id: todaysCostars.id,
      solution,
      hints,
      user_id: user.id
    });
  }
}

export const getUnlimitedStats = async () => {
  const user = await getUserFromClient();

  if (!user)
    return localStorageService.getUnlimitedStats();

  return await supabase_getUnlimitedStats(user.id);
}

export const updateUnlimitedStats = async (history: Array<GameEntity>, hints: Array<Hint>) => {
  const user = await getUserFromClient();
  const unlimitedStats = await getUnlimitedStats();

  if (history.length > unlimitedStats.high_score!)
    unlimitedStats.high_score = history.length;

  unlimitedStats.history = history;
  unlimitedStats.hints = hints;

  if (!user)
    localStorageService.updateUnlimitedStats(unlimitedStats);
  else
    supabase_updateUnlimitedStats(unlimitedStats);
}

export const getUserDailySolutions = async () => {
  const user = await getUserFromClient();

  if (!user) 
    return localStorageService.getSolutions();

  return supabase_getUserDailySolutions(user.id);
}