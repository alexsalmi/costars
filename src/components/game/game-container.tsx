'use client'
import CSSearchBar from '@/components/inputs/search';
import CSGameToolbar from '@/components/inputs/game-toolbar';
import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import useGameState from '@/store/game.state';
import '@/styles/game/game-container.scss';
import CSCard from '../presentation/card';
import { useEffect, useState } from 'react';
import { getCredits } from '@/services/tmdb.service';
import Success from './success';
import { isToday } from '@/services/utils.service';
import CSBackButton from '../inputs/back-button';

interface IGameProps {
	initPeople?: [GameEntity, GameEntity],
	daily?: boolean,
	dailySolutions?: DailySolutions
}

export default function GameContainer({ initPeople, daily, dailySolutions }: IGameProps) {
	const { current, gameType, target, score, highScore, dailyStats, hints, initGame, addEntity, updateDailyStats } = useGameState();
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (initPeople)
			initGame(initPeople, daily);

		if (daily && dailyStats.lastPlayed && isToday(new Date(dailyStats.lastPlayed)))
			setSuccess(true);
	}, []);


	const onSubmit = async (value: GameEntity) => {
		const isMatch = !current || current.credits!.includes(value.id);

		if (!isMatch)
			throw Error("Invalid guess");

		if (gameType !== 'unlimited') {
			const isTargetMatch = target.id === value.id && target.type == value.type;

			if (isTargetMatch && gameType === 'daily')
				updateDailyStats(value);

			if (isTargetMatch)
				setSuccess(true);
		}

		addEntity({
			...value,
			credits: (await getCredits(value.id, value.type)).map(credit => credit.id)
		});
	};

	if (success) {
		return <Success dailySolutions={dailySolutions} />;
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
