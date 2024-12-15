import '@/styles/components/toolbar.scss'
import CSButton from './button';
import {QuestionMarkOutlined, ReplayOutlined, UnfoldMoreOutlined, UnfoldLessOutlined, UndoOutlined, RedoOutlined} from '@mui/icons-material';
import useGameState from '@/store/game.state';
import CSResetModal from '../game/reset-modal';
import { useState } from 'react';
import CSTooltip from '../presentation/tooltip';

export default function CSGameToolbar() {
  const { history, gameType, undoCache, condensed, expandAll, collapseAll, undo, redo } = useGameState();
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
        <CSTooltip title="Click on any actor or movie to use a hint and see their credits"
          disableFocusListener
          enterTouchDelay={10}
        >
          <span>
            <CSButton secondary>
              <QuestionMarkOutlined />
            </CSButton>
          </span>
        </CSTooltip>
        <CSButton secondary
          disabled={history.length < 1}
          onClick={condensed ? expandAll : collapseAll}
        >
          { condensed ? 
            <UnfoldMoreOutlined />
            :
            <UnfoldLessOutlined />
          }
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
