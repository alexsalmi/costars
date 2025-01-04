import { useAtom } from 'jotai';
import {
  scoreAtom,
  historyAtom,
  gameTypeAtom,
  highScoreAtom,
  currentAtom,
  undoCacheAtom,
  completedAtom,
  hintsAtom,
  isSolutionAtom,
  targetAtom,
  userAtom,
  dailyStatsAtom,
  unlimitedStatsAtom,
  dailyCostarsAtom,
} from './costars.atoms';

import {
  getDailyStats,
  updateDailyStats as updateDailyStatsStorage,
  getUnlimitedStats,
  updateUnlimitedStats,
  postSolution,
} from '@/services/userdata.service';
import { isMigrationPending } from '@/utils/localstorage';
import { getUser } from '@/services/supabase/auth.service';
import { getUserSolution } from '@/utils/utils';

const useCostarsState = () => {
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
  const [user, setUser] = useAtom(userAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [unlimitedStats, setUnlimitedStats] = useAtom(unlimitedStatsAtom);
  const [dailyCostars, setDailyCostars] = useAtom(dailyCostarsAtom);

  // Actions
  const bootstrapUserState = () => {
    if (isMigrationPending()) return;

    getUser().then((res) => setUser(res));

    const localDailyStats = getDailyStats();
    setDailyStats(localDailyStats);

    const localUnlimitedStats = getUnlimitedStats();
    setUnlimitedStats(localUnlimitedStats);
  };

  const initGame = async (
    type: GameType,
    costars?: [GameEntity, GameEntity],
    daily?: DailyCostars,
  ) => {
    setGameType(type);

    if (type === 'unlimited') {
      let stats = unlimitedStats;
      if (!stats) {
        stats = getUnlimitedStats();
        setUnlimitedStats(stats);
      }
      setHistory(stats.history!);
      setHints(stats.hints!);
      setHighScore(stats.high_score!);
      setTarget({} as GameEntity);
      setUndoCache([]);
      setCompleted(false);

      return;
    }

    const [target, starter] = costars!;
    let solution: Solution | null = null;

    if (daily) {
      solution = getUserSolution(daily.id!);
      setDailyCostars(daily);
    }

    setTarget(target);
    setHistory(solution?.solution || [starter]);
    setHints(solution?.hints || []);
    setUndoCache([]);
    setCompleted(solution !== null);
  };

  const addEntity = (entity: GameEntity, captureEvent?: (eventName: string) => void) => {
    let newHistory = [entity, ...history];

    if (gameType !== 'unlimited') {
      const isTargetMatch =
        target.id === entity.id && target.type == entity.type;

      if (isTargetMatch && gameType === 'daily') updateDailyStats(entity);

      if (isTargetMatch && gameType === 'daily' && captureEvent)
        captureEvent('dailyCostarsCompleted');

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

      updateUnlimitedStats(user, newHistory, hints);

      setUnlimitedStats(getUnlimitedStats());
    }
  };

  const addHint = (entity: GameEntity) => {
    const hintData: Hint = {
      id: entity.id,
      type: entity.type,
    };

    setHints([...hints, hintData]);

    if (gameType === 'unlimited') {
      updateUnlimitedStats(user, history, [...hints, hintData]);

      setUnlimitedStats(getUnlimitedStats());
    }
  };

  const updateDailyStats = async (value: GameEntity) => {
    await updateDailyStatsStorage(user, [value, ...history].reverse(), hints);
    setDailyStats(getDailyStats());
  };

  const saveSolution = async (value: GameEntity) => {
    postSolution(user, [value, ...history].reverse(), hints, dailyCostars?.id);
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
    user,
    hints,
    score,
    target,
    current,
    history,
    gameType,
    highScore,
    undoCache,
    completed,
    isSolution,
    dailyStats,
    unlimitedStats,
    bootstrapUserState,
    initGame,
    updateDailyStats,
    addEntity,
    addHint,
    reset,
    undo,
    redo,
  };
};

export default useCostarsState;
