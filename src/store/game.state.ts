import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom, targetAtom, dailyStatsAtom, completedAtom, hintsAtom, isSolutionAtom } from "./atoms/game";
import { getUnlimitedSave, incrementHighscore as incrementHighscoreStorage, updateUnlimitedSave, updateDailyStats as updateDailyStatsStorage, getDailyStats } from "@/services/storage.service";
import { isToday } from "@/services/utils.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [hints, setHints] = useAtom(hintsAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [condensed, setCondensed] = useAtom(condensedAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [completed] = useAtom(completedAtom);
  const [isSolution] = useAtom(isSolutionAtom);

  // Actions
  const initUnlimitedGame = () => {
    setGameType('unlimited');

    const saveData = getUnlimitedSave();
    setHistory(saveData.history);
    setHints(saveData.hints);
    setTarget({} as GameEntity);
    setUndoCache([]);
  }

  const initCustomGame = () => {
    setGameType('custom');
    setTarget({} as GameEntity);
    setHistory([]);
    setHints([]);
    setUndoCache([]);
  }

  const initGame = async ([target, starter]: [GameEntity, GameEntity], daily?: boolean) => {
    setGameType(daily ? 'daily' : 'custom');

    if (daily && dailyStats.lastSolve && dailyStats.lastPlayed && isToday(new Date(dailyStats.lastPlayed))) {
      setTarget(dailyStats.lastSolve[0]);
      setHistory(dailyStats.lastSolve);
      setHints(dailyStats.lastSolveHints || []);
    }
    else {
      setTarget(target);
      setHistory([starter]);
      setHints([]);
    }
  }

  const addEntity = (entity: GameEntity) => {
    setHistory([entity, ...history]);
    setUndoCache([]);
    
    if (gameType === 'unlimited') {
      if (history.length >= highScore)
        incrementHighscore();
      
      updateUnlimitedSave([entity, ...history], hints);
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
      updateUnlimitedSave(history, [...hints, hintData]);
		}
  }

  const updateDailyStats = (value: GameEntity) => {
    updateDailyStatsStorage([value, ...history], hints);
    setDailyStats(getDailyStats());
  }

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
    incrementHighscoreStorage();
  }

  const reset = () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      updateUnlimitedSave([], []);
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