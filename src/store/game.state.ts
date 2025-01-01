import { useAtom } from 'jotai';
import {
  scoreAtom,
  historyAtom,
  gameTypeAtom,
  highScoreAtom,
  currentAtom,
  undoCacheAtom,
  targetAtom,
  dailyStatsAtom,
  completedAtom,
  hintsAtom,
  isSolutionAtom,
  userAtom,
  unlimitedStatsAtom,
  lastSolveAtom,
  todaysCostarsAtom,
  todaysSolutionsAtom,
  userDailySolutionsAtom,
} from './atoms/game';

import {
  getDailyStats,
  updateDailyStats as updateDailyStatsStorage,
  getUnlimitedStats,
  getUserDailySolutions,
  updateUnlimitedStats,
  postSolution,
} from '@/services/userdata.service';
import { getUser } from '@/services/supabase/auth.service';
import { isMigrationPending } from '@/utils/localstorage';

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [hints, setHints] = useAtom(hintsAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [completed, setCompleted] = useAtom(completedAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [isSolution] = useAtom(isSolutionAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [unlimitedStats, setUnlimitedStats] = useAtom(unlimitedStatsAtom);
  const [userDailySolutions, setUserDailySolutions] = useAtom(
    userDailySolutionsAtom,
  );
  const [lastSolve, setLastSolve] = useAtom(lastSolveAtom);
  const [todaysCostars, setTodaysCostars] = useAtom(todaysCostarsAtom);
  const [todaysSolutions, setTodaysSolutions] = useAtom(todaysSolutionsAtom);
  const [user, setUser] = useAtom(userAtom);

  // Actions
  const bootstrapState = async () => {
    if (isMigrationPending()) return;

    getUser().then((res) => setUser(res));

    const localDailyStats = getDailyStats();
    setDailyStats(localDailyStats);

    const localUnlimitedStats = getUnlimitedStats();
    setUnlimitedStats(localUnlimitedStats);

    const solutions = getUserDailySolutions();
    setUserDailySolutions(solutions);

    const localSolve =
      solutions.find(
        (sol) => sol.daily_id === localDailyStats.last_played_id,
      ) || null;
    setLastSolve(localSolve);
  };

  const initUnlimitedGame = async () => {
    setGameType('unlimited');

    let stats = unlimitedStats;

    if (stats === null) {
      stats = await getUnlimitedStats();
      setUnlimitedStats(stats);
    }

    setHistory(stats.history!);
    setHints(stats.hints!);
    setHighScore(stats.high_score!);
    setTarget({} as GameEntity);
    setUndoCache([]);
    setCompleted(false);
  };

  const initCustomGame = () => {
    setGameType('custom');
    setTarget({} as GameEntity);
    setHistory([]);
    setHints([]);
    setUndoCache([]);
    setCompleted(false);
  };

  const initGame = async (
    [target, starter]: [GameEntity, GameEntity],
    daily?: DailyCostars,
    solutions?: Array<Solution>,
    archive?: boolean,
  ) => {
    setGameType(archive ? 'archive' : daily ? 'daily' : 'custom');
    setCompleted(false);

    let stats = dailyStats;
    let solve = lastSolve;

    if (daily) setTodaysCostars(daily);

    if (solutions) setTodaysSolutions(solutions);

    if (daily && !archive && stats === null) {
      stats = await getDailyStats();
      setDailyStats(stats);
    }

    if (daily) {
      const solutions = await getUserDailySolutions();
      solve = solutions.find((sol) => sol.daily_id === daily.id) || null;
      setLastSolve(solve);
    }

    if (daily && solve) {
      setTarget(daily.target);
      setHistory(solve.solution);
      setHints(solve.hints || []);
      setCompleted(true);
    } else {
      setTarget(target);
      setHistory([starter]);
      setHints([]);
    }
  };

  const addEntity = async (entity: GameEntity) => {
    let newHistory = [entity, ...history];

    if (gameType !== 'unlimited') {
      const isTargetMatch =
        target.id === entity.id && target.type == entity.type;

      if (isTargetMatch && gameType === 'daily') updateDailyStats(entity);

      if (isTargetMatch && (gameType === 'daily' || gameType === 'archive'))
        saveSolution(entity);

      if (isTargetMatch) {
        setCompleted(true);
        newHistory = newHistory.reverse();
      }
    }

    setHistory(newHistory);
    setUndoCache([]);

    if (gameType === 'unlimited') {
      if (history.length >= highScore) incrementHighscore();

      await updateUnlimitedStats(user, newHistory, hints);

      setUnlimitedStats(await getUnlimitedStats());
    }
  };

  const addHint = async (entity: GameEntity) => {
    const hintData: Hint = {
      id: entity.id,
      type: entity.type,
    };

    setHints([...hints, hintData]);

    if (gameType === 'unlimited') {
      await updateUnlimitedStats(user, history, [...hints, hintData]);

      setUnlimitedStats(await getUnlimitedStats());
    }
  };

  const updateDailyStats = async (value: GameEntity) => {
    await updateDailyStatsStorage(user, [value, ...history].reverse(), hints);
    setDailyStats(await getDailyStats());
  };

  const saveSolution = async (value: GameEntity) => {
    await postSolution(
      user,
      [value, ...history].reverse(),
      hints,
      todaysCostars?.id,
    );
    setUserDailySolutions(await getUserDailySolutions());
  };

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
  };

  const reset = async () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      await updateUnlimitedStats(user, [], []);

      setUnlimitedStats(await getUnlimitedStats());
    } else {
      setHistory(history.slice(-1));
    }
  };

  const undo = () => {
    setUndoCache([history[0], ...undoCache]);
    setHistory(history.slice(1));
  };

  const redo = () => {
    setHistory([undoCache[0], ...history]);
    setUndoCache(undoCache.slice(1));
  };

  return {
    hints,
    score,
    target,
    current,
    history,
    gameType,
    highScore,
    undoCache,
    completed,
    dailyStats,
    unlimitedStats,
    userDailySolutions,
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
  };
};

export default useGameState;
