'use client';
import CSSearchBar from '@/components/inputs/search-bar';
import CSGameToolbar from '@/components/inputs/toolbars/game-toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import CSCard from '../presentation/card';
import { useEffect } from 'react';
import { getCredits } from '@/services/tmdb.service';
import Success from './success';
import CSBackButton from '../inputs/buttons/back-button';
import '@/styles/game/game-container.scss';

interface ICSGameContainerProps {
  initPeople?: [GameEntity, GameEntity];
  daily?: DailyCostars;
  solutions?: Array<Solution>;
  archive?: boolean;
}

export default function CSGameContainer({
  initPeople,
  daily,
  solutions,
  archive,
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
  } = useGameState();

  const isUnlimited = !initPeople;

  useEffect(() => {
    if (!isUnlimited) initGame(initPeople, daily, solutions, archive);
  }, []);

  const onSubmit = async (value: GameEntity) => {
    addEntity({
      ...value,
      credits: (await getCredits(value.id, value.type)).map(
        (credit) => credit.id,
      ),
    });
  };

  if (!isUnlimited && completed) {
    return <Success />;
  }

  return (
    <div className='game-container'>
      <CSBackButton link={gameType === 'archive' ? '/daily/archive' : ''} />
      <CSSearchBar onSubmit={onSubmit} />
      {gameType === 'unlimited' ? (
        <div className='game-scores'>
          <CSTextDisplay>Current Score: {score}</CSTextDisplay>
          <CSTextDisplay>High Score: {highScore}</CSTextDisplay>
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
        <CSGameToolbar />
        <CSCardTrack showPrompt />
      </div>
    </div>
  );
}
