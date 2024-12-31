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

import { warnForConflict } from '@/utils/utils';
import {
  getDailyStats,
  updateDailyStats as updateDailyStatsStorage,
  getUnlimitedStats,
  getUserDailySolutions,
  updateUnlimitedStats,
  migrateSaveDate,
  saveSolution as saveSolutionStorage,
} from '@/services/userdata.service';
import { getUser } from '@/services/supabase/auth.service';
import localStorageService from '@/services/localstorage.service';
import { sb_GetDailyStats } from '@/services/supabase';

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
    let localUser = user;
    if (localUser === null) {
      localUser = await getUser();
      setUser(localUser);
    }

    const authPending =
      localUser && localStorageService.getAuthStatus() === 'pending';
    let migrationNeeded = false;
    let authConflict = false;

    if (authPending && !localStorageService.isFresh()) {
      const hasDailyStats =
        (await sb_GetDailyStats({ user_id: localUser!.id })) !== null;

      migrationNeeded = !localStorageService.isFresh() && !hasDailyStats;
      authConflict = !localStorageService.isFresh() && hasDailyStats;
    }

    if (authConflict) await warnForConflict();

    if (migrationNeeded) {
      await migrateSaveDate(localUser);
      localStorageService.setAuthStatus('true');
    }

    const promises = [];

    if (dailyStats === null) {
      promises.push(
        getDailyStats(localUser).then(async (res) => {
          setDailyStats(res);

          if (lastSolve === null) {
            const solutions = await getUserDailySolutions(localUser);
            const solve =
              solutions.find((sol) => sol.daily_id === res.last_played_id) ||
              null;
            setUserDailySolutions(solutions);
            setLastSolve(solve);
          }
        }),
      );
    }

    if (unlimitedStats === null)
      promises.push(
        getUnlimitedStats(localUser).then((res) => setUnlimitedStats(res)),
      );

    if (localUser !== null)
      Promise.all(promises).then(() =>
        localStorageService.setAuthStatus('true'),
      );
  };

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
      stats = await getDailyStats(user);
      setDailyStats(stats);
    }

    if (daily) {
      const solutions = await getUserDailySolutions(user);
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

      setUnlimitedStats(await getUnlimitedStats(user));
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

      setUnlimitedStats(await getUnlimitedStats(user));
    }
  };

  const updateDailyStats = async (value: GameEntity) => {
    await updateDailyStatsStorage(user, [value, ...history].reverse(), hints);
    setDailyStats(await getDailyStats(user));
  };

  const saveSolution = async (value: GameEntity) => {
    await saveSolutionStorage(
      user,
      [value, ...history].reverse(),
      hints,
      todaysCostars?.id,
    );
    setUserDailySolutions(await getUserDailySolutions(user));
  };

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
  };

  const reset = async () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      await updateUnlimitedStats(user, [], []);

      setUnlimitedStats(await getUnlimitedStats(user));
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
