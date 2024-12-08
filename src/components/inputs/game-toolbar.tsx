import '@/styles/components/toolbar.scss'
import CSButton from './button';
import {ReplayOutlined, UnfoldMoreOutlined, UnfoldLessOutlined, UndoOutlined, RedoOutlined} from '@mui/icons-material';
import useGameState from '@/store/game.state';
import CSResetModal from '../game/reset-modal';
import { useState } from 'react';

export default function CSGameToolbar() {
  const { history, gameType, undoCache, expandAll, collapseAll, undo, redo } = useGameState();
	const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if(gameType === 'unlimited' ? history.length > 0 : history.length > 1)
      setIsModalOpen(true);
  }
  
  return (
    <>
      <div
        className='cs-toolbar'
      >
        <CSButton secondary
          disabled={history.length < 1}
          onClick={collapseAll}
        >
          <UnfoldLessOutlined />
        </CSButton>
        <CSButton secondary
          disabled={history.length < 1}
          onClick={expandAll}
        >
          <UnfoldMoreOutlined />
        </CSButton>
        <CSButton
          onClick={openModal}
        >
          <ReplayOutlined />
        </CSButton>
        <CSButton secondary
          disabled={ gameType === 'unlimited' ? history.length < 1 : history.length < 2 }
          onClick={undo}
        >
          <UndoOutlined />
        </CSButton>
        <CSButton secondary
          disabled={undoCache.length < 1}
          onClick={redo}
        >
          <RedoOutlined />
        </CSButton>
      </div>

      <CSResetModal 
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
      />
    </>
  );
}
