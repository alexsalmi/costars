'use client';
import CSSearchBar from '@/components/inputs/search-bar';
import CSGameToolbar from '@/components/inputs/game-toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useCostarsState from '@/store/costars.state';
import CSCard from '../presentation/card';
import { useEffect, useRef, useState } from 'react';
import Success from './success';
import CSBackButton from '../inputs/buttons/back-button';
import '@/styles/game/game-container.scss';
import { usePlausible } from 'next-plausible';

interface ICSGameContainerProps {
  type: GameType;
  initPeople?: [GameEntity, GameEntity];
  daily?: DailyCostars;
  solutions?: Array<Solution>;
}

export default function CSGameContainer({
  type,
  initPeople,
  daily,
  solutions,
}: ICSGameContainerProps) {
  const {
    gameType,
    target,
    score,
    highScore,
    hints,
    completed,
    initGame,
    addEntity,
    undo,
    redo,
  } = useCostarsState();
  const plausible = usePlausible();

  const [initializing, setInitializing] = useState(true);
  const [condenseAllCards, setCondenseAllCards] = useState(false);
  const [animateHighScore, setAnimateHighScore] = useState(false);
  const [cardAnimation, setCardAnimation] = useState<
    '' | 'slide-in' | 'slide-out'
  >('');
  const initialHighScore = useRef<null | number>(null);

  useEffect(() => {
    initGame(type, initPeople, daily).then(() => setInitializing(false));
  }, []);

  useEffect(() => {
    let high = initialHighScore.current;
    if (!high) {
      initialHighScore.current = highScore;
      high = highScore;
    }

    if (gameType !== 'unlimited' || score <= high) return;

    setAnimateHighScore(true);
  }, [score]);

  const onSubmit = async (value: GameEntity) => {
    addEntity(value, plausible);
    setCardAnimation('slide-in');

    setTimeout(async () => {
      setCardAnimation('');
    }, 300);
  };

  const onUndo = () => {
    setCardAnimation('slide-out');

    setTimeout(() => {
      setCardAnimation('');
      undo();
    }, 300);
  };

  const onRedo = () => {
    redo();
    setCardAnimation('slide-in');

    setTimeout(() => {
      setCardAnimation('');
    }, 300);
  };

  if (gameType !== 'unlimited' && completed && !initializing) {
    return <Success daily={daily} solutions={solutions} />;
  }

  return (
    <div className='game-container'>
      <CSBackButton />
      <CSSearchBar onSubmit={onSubmit} />
      {gameType === 'unlimited' ? (
        <div className='game-scores'>
          <CSTextDisplay>Current Score: {score}</CSTextDisplay>
          <CSTextDisplay animate={animateHighScore}>
            High Score: {highScore}
          </CSTextDisplay>
        </div>
      ) : (
        <div className='game-target'>
          <CSCard
            entity={target}
            target
            reverse
            hintUsed={hints.some(
              (hint) => hint.id === target.id && hint.type === target.type,
            )}
          />
        </div>
      )}
      <div className='game-card-section'>
        <CSGameToolbar
          condensed={condenseAllCards}
          setCondensed={setCondenseAllCards}
          undo={onUndo}
          redo={onRedo}
        />
        <CSCardTrack
          showPrompt
          condenseAll={condenseAllCards}
          cardAnimation={cardAnimation}
        />
      </div>
    </div>
  );
}
