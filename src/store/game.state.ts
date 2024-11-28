import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom } from "./atoms/game";
import { getUnlimitedSave, incrementHighscore as incrementHighscoreStorage, updateUnlimitedSave} from "@/services/storage.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [condensed, setCondensed] = useAtom(condensedAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
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
  }

  const incrementHighscore = () => {
    setHighScore(highScore + 1);
    incrementHighscoreStorage();
  }

  const reset = () => {
    setHistory([]);
    updateUnlimitedSave([]);
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
    current,
    history,
    gameType,
    highScore,
    undoCache,
    condensed,
    addEntity,
    initUnlimitedGame,
    reset,
    undo,
    redo,
    expandAll,
    collapseAll,
  }
}

export default useGameState;