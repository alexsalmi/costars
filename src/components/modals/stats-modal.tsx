'use client'
import CSModal from '../presentation/modal';
import useGameState from '@/store/game.state';
import '@/styles/game/stats-modal.scss'
import CSTextDisplay from '../presentation/display';
import CSButton from '../inputs/button';
import { ShareOutlined } from '@mui/icons-material';
import CSCardTrack from '../presentation/card-track';
import CSSolutionsToolbar from '../inputs/solutions-toolbar';
import { useEffect, useState } from 'react';
import { getScoreString } from '@/utils/utils';
import { getTodaysCostars } from '@/services/cache.service';
import { getDailyStats } from '@/services/userdata.service';
import { supabase_getDailySolutions, supabase_saveSolution } from '@/services/supabase.service';

interface ICSStatsModalProps {
	isOpen: boolean,
	close: () => void
}

export default function CSStatsModal({ isOpen, close }: ICSStatsModalProps) {
	const { score, history, hints } = useGameState();
	const [solutionInd, setSolutionInd] = useState(0);
	const [shareLoading, setShareLoading] = useState(false);
	const [costars, setCostars] = useState<DailyCostars | null>(null);
	const [solutions, setSolutions] = useState<Array<Solution>>([]);
	const [stats, setStats] = useState<DailyStats | null>(null);

	useEffect(() => {
		getTodaysCostars().then(async costars => {
			setCostars(costars);
			setSolutions(await supabase_getDailySolutions(costars.id!))
		})

		getDailyStats().then(dailyStats => {
			setStats(dailyStats);
		})
	}, []);

	const numMovies = (score-1)/2;
	const numHints = history.reduce(
		(acc, curr) => 
			acc + (hints.some(hint => hint.id === curr.id && hint.type === curr.type) ? 1 : 0), 
		0
	);

	const shareScore = async () => {
		if (!costars)
			return;

		setShareLoading(true);
		const uuid = await supabase_saveSolution({
			daily_id: costars.id!,
			solution: history,
			hints,
			is_temporary: true
		});
		setShareLoading(false);

    try{
      window.navigator.share({
        title: "Costars",
        text: `Daily Costars #${costars.day_number}\n${getScoreString(history, hints)}\nCheck out my solution!
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
						<span>{stats?.days_played}</span>
						<span>Days Played</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{stats ? Math.round(stats!.optimal_solutions!/stats!.days_played!*100) : 0}%</span>
						<span>Percent Optimal</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{stats?.optimal_solutions}</span>
						<span>Perfect Games</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{stats?.current_streak}</span>
						<span>Current Streak</span>
					</CSTextDisplay>
					<CSTextDisplay>
						<span>{stats?.highest_streak}</span>
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
					Here are a few of the <strong>{costars?.num_solutions} different ways</strong> to connect <strong>{costars?.starter.label}</strong> and <strong>{costars?.target.label}</strong> in 2 movies:
				</div>
				<div className='stats-modal-solutions'>
					<CSSolutionsToolbar 
						leftClick={() => setSolutionInd(solutionInd-1)}
						rightClick={() => setSolutionInd(solutionInd+1)}
						leftDisabled={solutionInd === 0}
						rightDisabled={solutionInd === solutions.length-1}
					/>
					<CSCardTrack cards={solutions[solutionInd]?.solution} hideHints={true} fullHeight={true} />
				</div>
			</div>
		</CSModal>
  );
}
