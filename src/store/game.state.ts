import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom, targetAtom, dailyStatsAtom, completedAtom, hintsAtom, isSolutionAtom, userAtom, unlimitedStatsAtom, lastSolveAtom, todaysCostarsAtom, todaysSolutionsAtom } from "./atoms/game";

import { warnForConflict } from "@/utils/utils";
import { getDailyStats, updateDailyStats as updateDailyStatsStorage, getUnlimitedStats, getUserDailySolutions, updateUnlimitedStats, migrateSaveDate } from "@/services/userdata.service";
import { getUser } from "@/services/auth.service";
import localStorageService from "@/services/localstorage.service";
import { supabase_hasDailyStats } from "@/services/supabase.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [hints, setHints] = useAtom(hintsAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [condensed, setCondensed] = useAtom(condensedAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [completed, setCompleted] = useAtom(completedAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [isSolution] = useAtom(isSolutionAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [unlimitedStats, setUnlimitedStats] = useAtom(unlimitedStatsAtom);
  const [lastSolve, setLastSolve] = useAtom(lastSolveAtom);
  const [todaysCostars, setTodaysCostars] = useAtom(todaysCostarsAtom);
  const [todaysSolutions, setTodaysSolutions] = useAtom(todaysSolutionsAtom);
  const [user, setUser] = useAtom(userAtom);

  // Actions
  const bootstrapState = async () => {
    let localUser = user;
    if (localUser === null) {
      localUser = await getUser();
      setUser(localUser);
    }

    const authPending = localUser && localStorageService.getAuthStatus() === 'pending';
    let migrationNeeded = false;
    let authConflict = false;

    if (authPending && !localStorageService.isFresh()) {
      const hasDailyStats = await supabase_hasDailyStats(localUser!.id);
      migrationNeeded = !localStorageService.isFresh() && !hasDailyStats;
      authConflict = !localStorageService.isFresh() && hasDailyStats;
    }

    if(authConflict)
      await warnForConflict();

    if (migrationNeeded)
      await migrateSaveDate();

    const promises = [];

    if (dailyStats === null) {
      promises.push(getDailyStats(localUser).then(async res => {
        setDailyStats(res);

        if (lastSolve === null && res.last_played_id) {
          const solutions = await getUserDailySolutions(localUser);
          const solve = solutions.find(sol => sol.daily_id === res.last_played_id) || null;
          setLastSolve(solve);
        }
      }))
    }

    if (unlimitedStats === null)
      promises.push(getUnlimitedStats(localUser).then(res => setUnlimitedStats(res)))

    if (localUser !== null) 
      Promise.all(promises).then(() => localStorageService.setAuthStatus('true'));      
  }

  const initUnlimitedGame = async () => {
    setGameType('unlimited');

    let stats = unlimitedStats;

    if (stats === null) {
      stats = await getUnlimitedStats(user);
      setUnlimitedStats(stats);      
    }

    setHistory(stats.history!);
    setHints(stats.hints!);
    setHighScore(stats.high_score!);
    setTarget({} as GameEntity);
    setUndoCache([]);
    setCompleted(false);
  }

  const initCustomGame = () => {
    setGameType('custom');
    setTarget({} as GameEntity);
    setHistory([]);
    setHints([]);
    setUndoCache([]);
    setCompleted(false);
  }

  const initGame = async ([target, starter]: [GameEntity, GameEntity], daily?: DailyCostars, solutions?: Array<Solution>) => {
    setGameType(daily ? 'daily' : 'custom');
    setCompleted(false);

    let stats = dailyStats;
    let solve = lastSolve;

    if (daily)
      setTodaysCostars(daily);

    if (solutions)
      setTodaysSolutions(solutions);

    if (daily && stats === null) {
      stats = await getDailyStats(user);
      setDailyStats(stats);
    }

    if (daily && lastSolve === null && stats?.last_played_id) {
      const solutions = await getUserDailySolutions(user);
      solve = solutions.find(sol => sol.daily_id === stats.last_played_id) || null;
      setLastSolve(solve);
    }

    if (solve && stats?.last_played && stats.last_played_id === (daily?.id || -1)){
      setTarget(solve.solution[solve.solution.length-1]);
      setHistory(solve.solution);
      setHints(solve.hints || []);
      setCompleted(true);
    }
    else {
      setTarget(target);
      setHistory([starter]);
      setHints([]);
    }
  }

  const addEntity = (entity: GameEntity) => {
		const isMatch = !current || current.credits!.includes(entity.id);

		if (!isMatch)
			throw Error("Invalid guess");

    let newHistory = [entity, ...history];

		if (gameType !== 'unlimited') {
			const isTargetMatch = target.id === entity.id && target.type == entity.type;

			if (isTargetMatch && gameType === 'daily')
				updateDailyStats(entity);

      if(isTargetMatch){
        setCompleted(true);
        newHistory = newHistory.reverse();
      }
		}

    setHistory(newHistory);
    setUndoCache([]);
    
    if (gameType === 'unlimited') {
      if (history.length >= highScore)
        incrementHighscore();

      updateUnlimitedStats(user, newHistory, hints);
		}
  }

  const addHint = (entity: GameEntity) => {
    const hintData: Hint = {
      id: entity.id,
      type: entity.type
    };

    setHints([
      ...hints,
      hintData
    ])

    if (gameType === 'unlimited') {      
      updateUnlimitedStats(user, history, [...hints, hintData]);
		}
  }

  const updateDailyStats = async(value: GameEntity) => {
    await updateDailyStatsStorage(user, [value, ...history].reverse(), hints);
    setDailyStats(await getDailyStats(user));
  }

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
  }

  const reset = () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      updateUnlimitedStats(user, [], []);
    }
    else {
      setHistory(history.slice(-1));
    }
  }
  
  const undo = () => {
    setUndoCache([history[0], ...undoCache]);
    setHistory(history.slice(1))
  }

  const redo = () => {
    setHistory([undoCache[0], ...history]);
    setUndoCache(undoCache.slice(1));
  }

  const expandAll = () => {
    setCondensed(false);
  }

  const collapseAll = () => {
    setCondensed(true);
  }

  return {
    hints,
    score,
    target,
    current,
    history,
    gameType,
    highScore,
    undoCache,
    condensed,
    completed,
    dailyStats,
    unlimitedStats,
    lastSolve,
    isSolution,
    user,
    todaysCostars,
    todaysSolutions,
    bootstrapState,
    initUnlimitedGame,
    initCustomGame,
    initGame,
    updateDailyStats,
    addEntity,
    addHint,
    reset,
    undo,
    redo,
    expandAll,
    collapseAll,
  }
}

export default useGameState;