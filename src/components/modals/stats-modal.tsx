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
import { getScoreString } from '@/utils/utils';
import { supabase_saveSolution } from '@/services/supabase.service';

interface ICSStatsModalProps {
	isOpen: boolean,
	close: () => void
}

export default function CSStatsModal({ isOpen, close }: ICSStatsModalProps) {
	const { score, history, hints, dailyStats, todaysCostars, todaysSolutions } = useGameState();
	const [solutionInd, setSolutionInd] = useState(0);
	const [shareLoading, setShareLoading] = useState(false);

	const numMovies = (score-1)/2;
	const numHints = history.reduce(
		(acc, curr) => 
			acc + (hints.some(hint => hint.id === curr.id && hint.type === curr.type) ? 1 : 0), 
		0
	);

	const shareScore = async () => {
		if (!todaysCostars)
			return;

		setShareLoading(true);
		const uuid = await supabase_saveSolution({
			daily_id: todaysCostars.id!,
			solution: history,
			hints,
			is_temporary: true
		});
		setShareLoading(false);

    try{
      window.navigator.share({
        title: "Costars",
        text: `Daily Costars #${todaysCostars.day_number}\n${getScoreString(history, hints)}\nCheck out my solution!
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
						<strong>{"That's"} a perfect game!</strong>	
						: <></>
					}
				</div>
				<div className='stats-modal-stats'>
					<CSTextDisplay>
						<span>{dailyStats?.days_played}</span>
						<span>Days Played</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats ? Math.round(dailyStats!.optimal_solutions!/dailyStats!.days_played!*100) : 0}%</span>
						<span>Percent Optimal</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats?.optimal_solutions}</span>
						<span>Perfect Games</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats?.current_streak}</span>
						<span>Current Streak</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{dailyStats?.highest_streak}</span>
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
					Here are a few of the <strong>{todaysCostars?.num_solutions} different ways</strong> to connect <strong>{todaysCostars?.starter.label}</strong> and <strong>{todaysCostars?.target.label}</strong> in 2 movies:
				</div>
				<div className='stats-modal-solutions'>
					<CSSolutionsToolbar 
						leftClick={() => setSolutionInd(solutionInd-1)}
						rightClick={() => setSolutionInd(solutionInd+1)}
						leftDisabled={solutionInd === 0}
						rightDisabled={solutionInd === (todaysSolutions?.length || 1)-1}
					/>
					<CSCardTrack cards={todaysSolutions ? todaysSolutions[solutionInd]?.solution : []} hideHints={true} fullHeight={true} />
				</div>
			</div>
		</CSModal>
  );
}
