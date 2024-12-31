import '@/styles/components/toolbar.scss';
import CSButton from '../buttons/button';
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from '@mui/icons-material';

interface ICSSolutionsToolbarProps {
  leftClick: () => void;
  rightClick: () => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
}

export default function CSSolutionsToolbar({
  leftClick,
  rightClick,
  leftDisabled,
  rightDisabled,
}: ICSSolutionsToolbarProps) {
  return (
    <>
      <div className='cs-toolbar cs-solutions-toolbar'>
        <CSButton secondary disabled={leftDisabled} onClick={leftClick}>
          <KeyboardArrowLeftOutlined />
        </CSButton>
        <CSButton secondary disabled={rightDisabled} onClick={rightClick}>
          <KeyboardArrowRightOutlined />
        </CSButton>
      </div>
    </>
  );
}
