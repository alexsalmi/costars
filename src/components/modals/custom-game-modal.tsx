'use client';
import CSModal from '../presentation/modal';
import CSButton from '../inputs/button';
import { useEffect, useState } from 'react';
import { ShareOutlined, SkipNextOutlined } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Link from 'next/link';
import '@/styles/game/custom-game-modal.scss';
import { useRouter } from 'next/navigation';
import useGameState from '@/store/game.state';
import CSCostarsGenerator from '../inputs/costars-generator';

export default function CSCustomGameModal() {
  const { initCustomGame } = useGameState();
  const [target, setTarget] = useState(null as GameEntity | null);
  const [starter, setStarter] = useState(null as GameEntity | null);
  const [openToast, setOpenToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initCustomGame();
  }, []);

  const shareLink = () => {
    if (!target || !starter) return;

    try {
      window.navigator.share({
        title: 'Costars',
        text: `Connect ${starter.label} and ${target.label} in as few movies as possible!`,
        url: `${location.origin}/custom/${target.id.toString(36)}..${starter.id.toString(36)}`,
      });
    } catch {
      window.navigator.clipboard.writeText(
        `${location.origin}/custom/${target.id.toString(36)}..${starter.id.toString(36)}`,
      );
      setOpenToast(true);
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <CSModal
      isOpen
      close={() => {
        router.push('/');
      }}
      className='custom-game-modal'
    >
      <div className='custom-game-header'>
        <h3>Custom Game</h3>
        <span>Choose two actors to connect!</span>
      </div>
      <CSCostarsGenerator
        target={target}
        starter={starter}
        setTarget={setTarget}
        setStarter={setStarter}
      />
      <div className='custom-game-modal-buttons'>
        <CSButton secondary disabled={!target || !starter} onClick={shareLink}>
          <ShareOutlined />
          Share
        </CSButton>
        {!target || !starter ? (
          <CSButton disabled>
            Start
            <SkipNextOutlined />
          </CSButton>
        ) : (
          <Link
            href={`/custom/${target.id.toString(36)}..${starter.id.toString(36)}`}
          >
            <CSButton>
              <span>Start</span>
              <SkipNextOutlined />
            </CSButton>
          </Link>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openToast}
        onClose={handleCloseToast}
        autoHideDuration={3000}
        message='Copied link to clipboard!'
        TransitionComponent={Slide}
        className='custom-game-modal-toast'
      />
    </CSModal>
  );
}
