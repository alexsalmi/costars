'use client';
import CSButton from './buttons/button';
import {
  QuestionMarkOutlined,
  ReplayOutlined,
  UnfoldMoreOutlined,
  UnfoldLessOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@mui/icons-material';
import useCostarsState from '@/store/costars.state';
import CSResetModal from '../modals/reset-modal';
import { useState } from 'react';
import CSTooltip from '../presentation/tooltip';
import '@/styles/inputs/toolbar.scss';

interface ICSGameToolbarProps {
  condensed: boolean;
  setCondensed: (val: boolean) => void;
  undo: () => void;
  redo: () => void;
}

export default function CSGameToolbar({
  condensed,
  setCondensed,
  undo,
  redo,
}: ICSGameToolbarProps) {
  const { history, gameType, undoCache } = useCostarsState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (gameType === 'unlimited' ? history.length > 0 : history.length > 1)
      setIsModalOpen(true);
  };

  return (
    <>
      <div className='cs-toolbar'>
        <CSButton onClick={openModal} secondary>
          <ReplayOutlined />
        </CSButton>
        <CSButton
          secondary
          disabled={history.length < 1}
          onClick={() => setCondensed(!condensed)}
        >
          {condensed ? <UnfoldMoreOutlined /> : <UnfoldLessOutlined />}
        </CSButton>
        <CSTooltip
          title='Click on any actor or movie to use a hint and see their credits'
          disableFocusListener
          enterTouchDelay={10}
          leaveTouchDelay={3000}
        >
          <span>
            <CSButton>
              <QuestionMarkOutlined />
            </CSButton>
          </span>
        </CSTooltip>
        <CSButton
          secondary
          disabled={
            gameType === 'unlimited' ? history.length < 1 : history.length < 2
          }
          onClick={undo}
        >
          <UndoOutlined />
        </CSButton>
        <CSButton secondary disabled={undoCache.length < 1} onClick={redo}>
          <RedoOutlined />
        </CSButton>
      </div>

      <CSResetModal isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
    </>
  );
}
