import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom, targetAtom, dailyStatsAtom } from "./atoms/game";
import { getUnlimitedSave, incrementHighscore as incrementHighscoreStorage, updateUnlimitedSave, updateDailyStats as updateDailyStatsStorage, getDailyStats } from "@/services/storage.service";
import { isToday } from "@/services/utils.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [condensed, setCondensed] = useAtom(condensedAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [dailyStats, setDailyStats] = useAtom(dailyStatsAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);

  // Actions
  const addEntity = (entity: GameEntity) => {
    setHistory([entity, ...history]);
    setUndoCache([]);
    
    if (gameType === 'unlimited') {
      if (history.length >= highScore)
        incrementHighscore();
      
      updateUnlimitedSave([entity, ...history]);
		}
  }

  const initUnlimitedGame = () => {
    setGameType('unlimited');

    const saveData = getUnlimitedSave();
    setHistory(saveData);
    setTarget({} as GameEntity);
    setUndoCache([]);
  }

  const initCustomGame = () => {
    setGameType('custom');
    setTarget({} as GameEntity);
    setHistory([]);
    setUndoCache([]);
  }

  const initGame = async ([target, starter]: [GameEntity, GameEntity], daily?: boolean) => {
    setGameType(daily ? 'daily' : 'custom');

    if (daily && dailyStats.lastSolve && dailyStats.lastPlayed && isToday(new Date(dailyStats.lastPlayed))) {
      setTarget(dailyStats.lastSolve[0]);
      setHistory(dailyStats.lastSolve);
      
    }
    else {
      setTarget(target);
      setHistory([starter]);
    }
  }

  const updateDailyStats = (value: GameEntity) => {
    updateDailyStatsStorage([value, ...history]);
    setDailyStats(getDailyStats());
  }

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
    incrementHighscoreStorage();
  }

  const reset = () => {
    if (gameType === 'unlimited') {
      setHistory([]);
      updateUnlimitedSave([]);
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
    score,
    target,
    current,
    history,
    gameType,
    highScore,
    undoCache,
    condensed,
    dailyStats,
    initUnlimitedGame,
    initCustomGame,
    initGame,
    updateDailyStats,
    addEntity,
    reset,
    undo,
    redo,
    expandAll,
    collapseAll,
  }
}

export default useGameState;