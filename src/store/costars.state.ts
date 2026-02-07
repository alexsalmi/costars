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
  syncUserData,
} from '@/services/userdata.service';
import { getUser } from '@/services/supabase/auth.service';
import { getUserSolution } from '@/utils/utils';
import {
  ls_DeleteDailySave,
  ls_GetDailySave,
  ls_PostDailySave,
} from '@/services/localstorage';
import { getCredits } from '@/services/tmdb.service';

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
    const localDailyStats = getDailyStats();
    setDailyStats(localDailyStats);

    const localUnlimitedStats = getUnlimitedStats();
    setUnlimitedStats(localUnlimitedStats);

    getUser().then((user) => {
      setUser(user);
      syncUserData(user);
    });
  };

  const resetGameState = () => {
    setHistory([]);
    setHints([]);
    setHighScore(0);
    setTarget({} as GameEntity);
    setUndoCache([]);
    setCompleted(false);
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

    let dailySave: Solution | null = null;

    if (type === 'daily' && !solution) {
      dailySave = ls_GetDailySave();
      if (dailySave?.daily_id !== daily?.id) dailySave = null;
    }

    setTarget(target);
    setHistory(solution?.solution || dailySave?.solution || [starter]);
    setHints(solution?.hints || dailySave?.hints || []);
    setUndoCache([]);
    setCompleted(solution !== null);
  };

  const addEntity = async (entity: GameEntity) => {
    let newHistory = [entity, ...history];

    if (gameType !== 'unlimited') {
      const isTargetMatch =
        target.id === entity.id && target.type == entity.type;

      if (isTargetMatch && gameType === 'daily') {
        updateDailyStats(entity);
        ls_DeleteDailySave();
      }

      if (isTargetMatch && (gameType === 'daily' || gameType === 'archive'))
        saveSolution(entity);

      if (isTargetMatch) {
        setCompleted(true);
        newHistory = newHistory.reverse();
      }
    }

    setHistory(newHistory);
    setUndoCache([]);

    newHistory[0].credits = (await getCredits(entity.id, entity.type)).map(
      (credit) => credit.id,
    );

    setHistory(newHistory);

    if (gameType === 'daily')
      ls_PostDailySave({
        daily_id: dailyCostars?.id,
        solution: newHistory,
        hints,
      });

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

    const newHints = [...hints, hintData];

    setHints(newHints);

    if (gameType === 'daily')
      ls_PostDailySave({
        daily_id: dailyCostars?.id,
        solution: history,
        hints: newHints,
      });

    if (gameType === 'unlimited') {
      updateUnlimitedStats(user, history, [...hints, hintData]);

      setUnlimitedStats(getUnlimitedStats());
    }
  };

  const updateDailyStats = async (value: GameEntity) => {
    updateDailyStatsStorage(
      user,
      [value, ...history].reverse(),
      hints,
      dailyCostars?.day_number || 0,
    );
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
      updateUnlimitedStats(user, [], []);

      setUnlimitedStats(getUnlimitedStats());
    } else {
      ls_DeleteDailySave();
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
    resetGameState,
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
