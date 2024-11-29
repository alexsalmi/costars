import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom, condensedAtom, targetAtom } from "./atoms/game";
import { getUnlimitedSave, incrementHighscore as incrementHighscoreStorage, updateUnlimitedSave} from "@/services/storage.service";
import { getCredits } from "@/services/tmdb.service";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [target, setTarget] = useAtom(targetAtom);
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

  const initCustomGame = async ([target, starter]: [PersonDetails, PersonDetails]) => {
    setGameType('custom');

    const targetEntity: GameEntity = {
      type: 'person',
      id: target.id,
      label: target.name,
      image: target.profile_path,
    };

    const starterEntity: GameEntity = {
      type: 'person',
      id: starter.id,
      label: starter.name,
      image: starter.profile_path,
    }

    setTarget({
      ...targetEntity,
      credits: (await getCredits(targetEntity)).cast.map(credit => credit.id)
    });
    setHistory([{
      ...starterEntity,
      credits: (await getCredits(starterEntity)).cast.map(credit => credit.id)
    }]);
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
    initUnlimitedGame,
    initCustomGame,
    addEntity,
    reset,
    undo,
    redo,
    expandAll,
    collapseAll,
  }
}

export default useGameState;