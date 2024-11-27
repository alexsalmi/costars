import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom, undoCacheAtom } from "./atoms/game";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [undoCache, setUndoCache] = useAtom(undoCacheAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [highScore] = useAtom(highScoreAtom);

  // Actions
  const addEntity = (entity: GameEntity) => {
    setHistory([entity, ...history]);
    setUndoCache([]);
    
		if (gameType === 'unlimited' && history.length >= highScore && typeof window !== 'undefined') {
			window.localStorage.setItem('costars-highscore', (highScore + 1).toString());
		}
  }

  const initUnlimitedGame = () => {
    setGameType('unlimited');
    setHistory([]);
  }

  const expandAll = () => {
    setHistory(
      history.map(entity => ({
        ...entity,
        collapsed: false,
      }))
    )
  }

  const collapseAll = () => {
    setHistory(
      history.map(entity => ({
        ...entity,
        collapsed: true,
      }))
    )
  }

  const undo = () => {
    setUndoCache([history[0], ...undoCache]);
    setHistory(history.slice(1))
  }

  const redo = () => {
    setHistory([undoCache[0], ...history]);
    setUndoCache(undoCache.slice(1));
  }

  return {
    score,
    current,
    history,
    gameType,
    highScore,
    undoCache,
    addEntity,
    initUnlimitedGame,
    expandAll,
    collapseAll,
    undo,
    redo
  }
}

export default useGameState;