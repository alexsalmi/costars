'use client'
import CSSearchBar from '@/components/inputs/search';
import CSToolbar from '@/components/inputs/toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/game/game-container.scss';
import CSCard from '../presentation/card';
import { useEffect, useState } from 'react';
import { getCredits } from '@/services/tmdb.service';
import Success from './success';

interface IGameProps {
  initPeople?: [GameEntity, GameEntity]
}

export default function GameContainer({ initPeople }: IGameProps) {
	const { current, gameType, target, score, highScore, initGame, addEntity } = useGameState();
	const [condensedTarget, setCondensedTarget] = useState(true);
	const [success, setSuccess] = useState(true);

	useEffect(() => {
		if (initPeople)
			initGame(initPeople)
	}, []);


	const onSubmit = async (value: GameEntity) => {
		const isMatch = !current || current.credits!.includes(value.id);

		if (!isMatch)
			throw Error("Invalid guess");

		if (gameType !== 'unlimited') {
			const isTargetMatch = target.id === value.id && target.type == value.type;

			if (isTargetMatch)
				setSuccess(true);
		}

		addEntity({
			...value,
			credits: (await getCredits(value)).cast.map(credit => credit.id)
		});
	};

	if (success) {
		return <Success />;
	}

  return (
		<div className='game-container'>
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
				<div className='game-target' onClick={() => setCondensedTarget(!condensedTarget)}>
					<CSCard entity={target} target reverse condensed={condensedTarget} />
				</div>
			}
			<div className='game-card-section'>
				<CSToolbar />
				<CSCardTrack showPrompt />
			</div>
    </div>
  );
}
