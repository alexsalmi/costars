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
  const [completed, setCompleted] = useAtom(completedAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [isSolution] = useAtom(isSolutionAtom);

  // Actions
  const initUnlimitedGame = () => {
    setGameType('unlimited');

    const saveData = getUnlimitedSave();
    setHistory(saveData.history);
    setHints(saveData.hints);
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

    if (daily && dailyStats.lastSolve && dailyStats.lastPlayed && isToday(new Date(dailyStats.lastPlayed))) {
      setTarget(dailyStats.lastSolve[dailyStats.lastSolve.length-1]);
      setHistory(dailyStats.lastSolve);
      setHints(dailyStats.lastSolveHints || []);
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
      
      updateUnlimitedSave(newHistory, hints);
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