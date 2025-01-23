import {
  QuestionMarkOutlined,
  ReplayOutlined,
  UnfoldLessOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@mui/icons-material';
import '@/styles/inputs/toolbar.scss';
import CSButton from '../inputs/buttons/button';

export default function CSToolbarSkeleton() {
  return (
    <>
      <div className='cs-toolbar'>
        <CSButton secondary disabled>
          <ReplayOutlined />
        </CSButton>
        <CSButton secondary disabled>
          <UnfoldLessOutlined />
        </CSButton>
        <CSButton disabled>
          <QuestionMarkOutlined />
        </CSButton>
        <CSButton secondary disabled>
          <UndoOutlined />
        </CSButton>
        <CSButton secondary disabled>
          <RedoOutlined />
        </CSButton>
      </div>
    </>
  );
}
