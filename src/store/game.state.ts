import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom, targetAtom, dailyStatsAtom, completedAtom, hintsAtom, isSolutionAtom, userAtom } from "./atoms/game";

import { isToday } from "@/utils/utils";
import { getDailyStats, updateDailyStats as updateDailyStatsStorage, getUnlimitedStats, getUserDailySolutions, updateUnlimitedStats } from "@/services/userdata.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [hints, setHints] = useAtom(hintsAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [condensed, setCondensed] = useAtom(condensedAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [completed, setCompleted] = useAtom(completedAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [isSolution] = useAtom(isSolutionAtom);
  const [user, setUser] = useAtom(userAtom);

  // Actions
  const initUnlimitedGame = async () => {
    setGameType('unlimited');

    const unlimitedStats = await getUnlimitedStats();

    setHistory(unlimitedStats.history!);
    setHints(unlimitedStats.hints!);
    setHighScore(unlimitedStats.high_score!);
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

  const initGame = async ([target, starter]: [GameEntity, GameEntity], daily?: boolean) => {
    setGameType(daily ? 'daily' : 'custom');
    setCompleted(false);

    let dailyStats: DailyStats | null = null;
    let lastSolve: Solution | null = null;

    if (daily) {
      dailyStats = await getDailyStats();
      const solutions = await getUserDailySolutions();
      lastSolve = solutions.find(sol => sol.daily_id === dailyStats!.last_played_id) || null;
    }

    if (lastSolve && dailyStats?.last_played && isToday(new Date(dailyStats.last_played))){
      setTarget(lastSolve.solution[lastSolve.solution.length-1]);
      setHistory(lastSolve.solution);
      setHints(lastSolve.hints || []);
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

      updateUnlimitedStats(newHistory, hints);
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
      updateUnlimitedStats(history, [...hints, hintData]);
		}
  }

  const updateDailyStats = async(value: GameEntity) => {
    updateDailyStatsStorage([value, ...history].reverse(), hints);
    setDailyStats(await getDailyStats());
  }

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
  }

  const reset = () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      updateUnlimitedStats([], []);
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
    isSolution,
    user,
    setUser,
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