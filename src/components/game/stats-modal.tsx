'use client'
import CSModal from '../presentation/modal';
import useGameState from '@/store/game.state';
import '@/styles/game/stats-modal.scss'
import CSTextDisplay from '../presentation/display';
import CSButton from '../inputs/button';
import { ShareOutlined } from '@mui/icons-material';
import CSCardTrack from '../presentation/card-track';
import CSSolutionsToolbar from '../inputs/solutions-toolbar';
import { useState } from 'react';
import { saveSolution } from '@/services/db.service';
import { getScoreString } from '@/services/utils.service';

interface ICSStatsModalProps {
	isOpen: boolean,
	close: () => void,
	daily: DailyCostars
}

export default function CSStatsModal({ isOpen, close, daily }: ICSStatsModalProps) {
	const { score, dailyStats, history, hints } = useGameState();
	const [solutionInd, setSolutionInd] = useState(0);
	const [shareLoading, setShareLoading] = useState(false);

	const numMovies = (score-1)/2;
	const numHints = history.reduce(
		(acc, curr) => 
			acc + (hints.some(hint => hint.id === curr.id && hint.type === curr.type) ? 1 : 0), 
		0
	);

  const shareScore = async () => {
		setShareLoading(true);
		const uuid = await saveSolution(history, hints, true);
		setShareLoading(false);

    try{
      window.navigator.share({
        title: "Costars",
        text: `Daily Costars #${daily.day_number}\n${getScoreString(history, hints)}\nCheck out my solution!
				`,
        url: `${location.origin}/solution/${uuid}`
      })
    } catch {
      window.navigator.clipboard.writeText(`${location.origin}/solution/${uuid}`);
    }
  }
	
  return (
		<CSModal isOpen={isOpen} close={close}>
			<div className='stats-modal-container'>
				<div className='stats-modal-recap'>
					<h3>Daily Stats</h3>
					<span>You connected {"today's"} costars in</span>
					<span>
						<strong>{numMovies} movies</strong>
            {
              numHints > 0 ?
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint.' : 'hints.'}
                </strong>
              </>
              :
              <span>.</span>
            }
					</span>
					{numMovies === 2 && numHints === 0 ?
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
				<div className='stats-modal-share-button'>
					<CSButton onClick={shareScore} loading={shareLoading}>
          	<ShareOutlined />
						Share your score
					</CSButton>
				</div>
				<hr />
				<div className='stats-modal-optimal'>
					Here are a few of the <strong>{daily.solutions.count} different ways</strong> to connect <strong>{daily.starter.label}</strong> and <strong>{daily.target.label}</strong> in 2 movies:
				</div>
				<div className='stats-modal-solutions'>
					<CSSolutionsToolbar 
						leftClick={() => setSolutionInd(solutionInd-1)}
						rightClick={() => setSolutionInd(solutionInd+1)}
						leftDisabled={solutionInd === 0}
						rightDisabled={solutionInd === daily.solutions.mostPopular.length-1}
					/>
					<CSCardTrack cards={daily.solutions.mostPopular[solutionInd]} hideHints={true} fullHeight={true} />
				</div>
			</div>
		</CSModal>
  );
}
