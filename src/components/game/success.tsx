'use client'
import CSCardTrack from '@/components/presentation/card-track';
import useGameState from '@/store/game.state';
import Link from 'next/link';
import CSButton from '../inputs/button';
import '@/styles/game/success.scss';
import { useState } from 'react';
import CSStatsModal from '../modals/stats-modal';
import CSBackButton from '../inputs/back-button';
import { ShareOutlined } from '@mui/icons-material';
import { supabase_saveSolution } from '@/services/supabase.service';
import { getScoreString } from '@/utils/utils';

export default function Success() {
  const { history, target, score, hints, gameType, todaysCostars } = useGameState();

	const [shareLoading, setShareLoading] = useState(false);
  const [statsOpen, setStatsOpen] = useState(gameType === 'daily');

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

    let label = `${history[0].label} ➡️ ${target.label}\n${getScoreString(history, hints)}\nCheck out my solution!`;

    if (gameType === 'daily' || gameType === 'archive')
      label = `Daily Costars #${todaysCostars.day_number}\n${label}`

    try{
      window.navigator.share({
        title: "Costars",
        text: label,
        url: `${location.origin}/solution/${uuid}`
      })
    } catch {
      window.navigator.clipboard.writeText(`${location.origin}/solution/${uuid}`);
    }
  }

  return (
    <>
      <CSBackButton link={gameType === 'archive' ? '/daily/archive' : ''} />
      <div className='success-container'>
        <div className='success-message-container'>
          <h3>Congratulations!</h3>
          <span>
            {'You connected '}
            <strong>{history[0].label}</strong>
            {' and '}
            <strong>{target.label}</strong>
            {' in '}
            <strong>
              {numMovies} {numMovies === 1 ? 'movie' : 'movies'}
            </strong>
            {
              numHints > 0 ?
              <>
                {' and '}
                <strong>
                  {numHints} {numHints === 1 ? 'hint!' : 'hints!'}
                </strong>
              </>
              :
              <span>!</span>
            }
          </span>
          <div className='success-buttons-container'>
            <div className='success-share-button'>
              <CSButton secondary onClick={shareScore} loading={shareLoading}>
                <ShareOutlined />
                Share
              </CSButton>
            </div>
            {gameType === 'daily' ?
              <CSButton onClick={() => setStatsOpen(true)}>See Stats</CSButton>
            : gameType === 'archive' ?
              <Link href="/daily/archive">
                <CSButton>
                  Archive
                </CSButton>
              </Link>   
            :
              <Link href="/custom">
                <CSButton>
                  New Game
                </CSButton>
              </Link>            
            }
          </div>
        </div>
        <CSCardTrack />
        {gameType === 'daily' ?
          <CSStatsModal isOpen={statsOpen} close={() => setStatsOpen(false)} />
          : <></>
        }
      </div>
    </>
  );
}
