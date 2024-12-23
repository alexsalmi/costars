'use client'
import CSSearchBar from '@/components/inputs/search';
import CSGameToolbar from '@/components/inputs/game-toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/game/game-container.scss';
import CSCard from '../presentation/card';
import { useEffect } from 'react';
import { getCredits } from '@/services/tmdb.service';
import Success from './success';
import CSBackButton from '../inputs/back-button';

interface IGameProps {
	initPeople?: [GameEntity, GameEntity],
	daily?: boolean
}

export default function GameContainer({ initPeople, daily }: IGameProps) {
	const { gameType, target, score, highScore, hints, completed, initGame, addEntity } = useGameState();

	const isUnlimited = !initPeople;

	useEffect(() => {
		if (!isUnlimited)
			initGame(initPeople, daily);
	}, []);


	const onSubmit = async (value: GameEntity) => {
		addEntity({
			...value,
			credits: (await getCredits(value.id, value.type)).map(credit => credit.id)
		});
	};

	if (!isUnlimited && completed) {
		return <Success />;
	}

  return (
		<div className='game-container'>
			<CSBackButton/>
			<CSSearchBar onSubmit={onSubmit} />
			{gameType === 'unlimited' ?
				<div className='game-scores'>
					<CSTextDisplay>
						Current Score: {score}
					</CSTextDisplay>
					<CSTextDisplay>
						High Score: {highScore}
					</CSTextDisplay>
				</div>
				:
				<div className='game-target'>
					<CSCard entity={target} target reverse
							hintUsed={hints.some(hint => hint.id === target.id && hint.type === target.type)} />
				</div>
			}
			<div className='game-card-section'>
				<CSGameToolbar />
				<CSCardTrack showPrompt />
			</div>
    </div>
  );
}
