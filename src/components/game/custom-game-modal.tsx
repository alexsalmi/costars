'use client'
import CSModal from '../presentation/modal';
import CSButton from '../inputs/button';
import CSSearchBar from '../inputs/search';
import { useState } from 'react';
import CSTextDisplay from '../presentation/display';
import { AutorenewOutlined, CloseOutlined, ArrowBackIosNewOutlined, ShareOutlined, SkipNextOutlined } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Link from 'next/link';
import '@/styles/game/custom-game-modal.scss'
import { getRandomPerson } from '@/services/cache.service';

export default function CSCustomGameModal() {
  const [target, setTarget] = useState(null as GameEntity | null);
  const [starter, setStarter] = useState(null as GameEntity | null);
  const [openToast, setOpenToast] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);
  const [starterLoading, setStarterLoading] = useState(false);


  const randomize = async (type: 'target' | 'starter') => {
    if (type === 'target')
      setTargetLoading(true);
    else
      setStarterLoading(true);

    const person = await getRandomPerson();

    if (type === 'target') {
      setTarget(person);
      setTargetLoading(false);
    }
    else {
      setStarter(person);
      setStarterLoading(false);
    }
  }


  const shareLink = () => {
    if (!target || !starter)
      return;

    try{
      window.navigator.share({
        title: "Costars",
        text: `Connect ${starter.label} and ${target.label} in as few movies as possible!`,
        url: `${location.origin}/custom/${target.id.toString(36)}..${starter.id.toString(36)}`
      })
    } catch {
      window.navigator.clipboard.writeText(`${location.origin}/custom/${target.id.toString(36)}..${starter.id.toString(36)}`);
      setOpenToast(true);
    }
  }


  const handleCloseToast = () => {
    setOpenToast(false);
  }


  return (
    <CSModal isOpen className='custom-game-modal'>
      <div className='custom-game-header'>
        <Link href="/" className='custom-game-modal-back-button'>
          <ArrowBackIosNewOutlined />
        </Link>
			  <h3>Custom Game</h3>
        <span>
          Choose two actors to connect!
        </span>
      </div>
      <div className='custom-game-modal-input-section'>
      <span>Target:</span>
      <span className='custom-game-modal-person-selector'>
        {
          target === null ?
            <>
              <CSSearchBar onSubmit={setTarget} />
              <CSButton loading={targetLoading} onClick={() => randomize('target')}>
                <AutorenewOutlined />
              </CSButton>
            </>
            :
            <>
              <CSTextDisplay>
                {target.label}
              </CSTextDisplay>
              <CSButton secondary onClick={() => setTarget(null)}>
                <CloseOutlined />
              </CSButton>
            </>
        }
      </span>
      </div>
      <div className='custom-game-modal-input-section'>
      <span>Starter:</span>
      <span className='custom-game-modal-person-selector'>
        {
          starter === null ?
            <>
              <CSSearchBar onSubmit={setStarter} />
              <CSButton loading={starterLoading} onClick={() => randomize('starter')}>
                <AutorenewOutlined />
              </CSButton>
            </>
            :
            <>
              <CSTextDisplay>
                {starter.label}
              </CSTextDisplay>
              <CSButton secondary onClick={() => setStarter(null)}>
                <CloseOutlined />
              </CSButton>
            </>
        }
        </span>
        </div>
			<div className="custom-game-modal-buttons">
				<CSButton 
          secondary
          disabled={!target || !starter}
          onClick={shareLink}
        >
          <ShareOutlined />
					Share
        </CSButton>
        {!target || !starter ?
          <CSButton disabled>
            Start
            <SkipNextOutlined />
          </CSButton>
        :
          <Link href={`/custom/${target.id.toString(36)}..${starter.id.toString(36)}`}>
            <CSButton>
              <span>Start</span>
              <SkipNextOutlined />
            </CSButton>
          </Link>
        }
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openToast}
        onClose={handleCloseToast}
        autoHideDuration={3000}
        message="Copied link to clipboard!"
        TransitionComponent={Slide}
        className='custom-game-modal-toast'
      />
		</CSModal>
  );
}
