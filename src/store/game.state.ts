import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom, currentAtom } from "./atoms/game";

const useGameState = () => {
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [current] = useAtom(currentAtom);
  const [score] = useAtom(scoreAtom);
  const [highScore] = useAtom(highScoreAtom);

  // Actions
  const addEntity = (entity: GameEntity) => {
    setHistory([entity, ...history]);
    
		if (gameType === 'unlimited' && history.length >= highScore && typeof window !== 'undefined') {
			window.localStorage.setItem('costars-highscore', (highScore + 1).toString());
		}
  }

  const initUnlimitedGame = () => {
    setGameType('unlimited');
    setHistory([]);
  }

  return {
    score,
    current,
    history,
    gameType,
    highScore,
    addEntity,
    initUnlimitedGame
  }
}

export default useGameState;