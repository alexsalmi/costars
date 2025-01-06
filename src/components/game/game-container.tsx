'use client';
import CSSearchBar from '@/components/inputs/search-bar';
import CSGameToolbar from '@/components/inputs/toolbars/game-toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useCostarsState from '@/store/costars.state';
import CSCard from '../presentation/card';
import { useEffect, useState } from 'react';
import { getCredits } from '@/services/tmdb.service';
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
  } = useCostarsState();
  const plausible = usePlausible();

  const [condenseAllCards, setCondenseAllCards] = useState(false);

  useEffect(() => {
    initGame(type, initPeople, daily);
  }, []);

  const onSubmit = async (value: GameEntity) => {
    addEntity(
      {
        ...value,
        credits: (await getCredits(value.id, value.type)).map(
          (credit) => credit.id,
        ),
      },
      plausible,
    );
  };

  if (gameType !== 'unlimited' && completed) {
    return <Success daily={daily} solutions={solutions} />;
  }

  return (
    <div className='game-container'>
      <CSBackButton />
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
        <CSGameToolbar
          condensed={condenseAllCards}
          setCondensed={setCondenseAllCards}
        />
        <CSCardTrack showPrompt condenseAll={condenseAllCards} />
      </div>
    </div>
  );
}
