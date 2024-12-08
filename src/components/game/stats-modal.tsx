'use client'
import CSModal from '../presentation/modal';
import useGameState from '@/store/game.state';
import '@/styles/game/stats-modal.scss'
import CSTextDisplay from '../presentation/display';
import CSButton from '../inputs/button';
import { CloseOutlined } from '@mui/icons-material';
import CSCardTrack from '../presentation/card-track';
import CSSolutionsToolbar from '../inputs/solutions-toolbar';
import { useState } from 'react';

interface ICSStatsModalProps {
	isOpen: boolean,
	close: () => void,
	dailySolutions?: DailySolutions
}

export default function CSStatsModal({ isOpen, close, dailySolutions }: ICSStatsModalProps) {
	const { score, dailyStats } = useGameState();
	const [solutionInd, setSolutionInd] = useState(0);

	const numMovies = (score-1)/2;
	
  return (
		<CSModal isOpen={isOpen}>
			<div className='stats-modal-container'>
				<div className='stats-modal-close-button'>
					<CSButton secondary onClick={() => close()}>
						<CloseOutlined/>
					</CSButton>
				</div>
				<div className='stats-modal-recap'>
					<span>You connected {"today's"} daily costars in</span>
					<strong>{numMovies} movies.</strong>
					{numMovies === 2 ?
						<strong>{"That's"} the optimal score!</strong>	
						: <></>
					}
				</div>
				<div className='stats-modal-stats'>
					<CSTextDisplay>
						<span>{dailyStats.daysPlayed}</span>
						<span>Days Played</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{Math.round(dailyStats.daysOptimal/dailyStats.daysPlayed*100)}%</span>
						<span>Percent Optimal</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats.daysOptimal}</span>
						<span>Optimal Scores</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats.currentStreak}</span>
						<span>Current Streak</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats.highestStreak}</span>
						<span>Highest Streak</span>
					</CSTextDisplay>
				</div>
				<div className='stats-modal-optimal'>
					Here are a few of the <strong>{dailySolutions!.count} different ways</strong> to connect the daily costars in 2 movies today:
				</div>
				<div className='stats-modal-solutions'>
					<CSSolutionsToolbar 
						leftClick={() => setSolutionInd(solutionInd-1)}
						rightClick={() => setSolutionInd(solutionInd+1)}
						leftDisabled={solutionInd === 0}
						rightDisabled={solutionInd === dailySolutions!.mostPopular.length-1}
					/>
					<CSCardTrack cards={dailySolutions?.mostPopular[solutionInd]}/>
				</div>
			</div>
		</CSModal>
  );
}
