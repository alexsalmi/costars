import '@/styles/components/toolbar.scss'
import CSButton from './button';
import {ReplayOutlined, UnfoldMoreOutlined, UnfoldLessOutlined, UndoOutlined, RedoOutlined} from '@mui/icons-material';
import useGameState from '@/store/game.state';

export default function CSToolbar() {
  const { history, undoCache, expandAll, collapseAll, undo, redo } = useGameState();
  
  return (
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
      <CSButton>
        <ReplayOutlined />
      </CSButton>
      <CSButton secondary
        disabled={history.length < 1}
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
  );
}
