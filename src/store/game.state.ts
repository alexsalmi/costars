import { useAtom } from "jotai";
import { scoreAtom, historyAtom, gameTypeAtom, highScoreAtom } from "./atoms/game";

const useGameState = () => {
  const [score] = useAtom(scoreAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [highScore] = useAtom(highScoreAtom);

  // Actions
  const addEntity = (entity: GameEntity) => {
    setHistory([entity, ...history]);
    
		if (gameType === 'unlimited' && history.length >= highScore) {
			window?.localStorage.setItem('costars-highscore', (highScore + 1).toString());
		}
  }

  const initUnlimitedGame = () => {
    setGameType('unlimited');
    setHistory([]);
  }

  return {
    score,
    history,
    gameType,
    highScore,
    addEntity,
    initUnlimitedGame
  }
}

export default useGameState;