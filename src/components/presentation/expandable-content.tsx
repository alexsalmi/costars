import { ExpandLessOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import CSButton from '../inputs/buttons/button';
import { useState } from 'react';
import '@/styles/presentation/expandable-content.scss';

interface IExpandableContentProps {
  label: string;
  children: React.ReactNode;
}

export default function ExpandableContent({
  label,
  children,
}: IExpandableContentProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='expandable-content'>
      <CSButton secondary onClick={() => setExpanded(!expanded)}>
        <h4>{label}</h4>
        {expanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
      </CSButton>
      {expanded ? children : <></>}
    </div>
  );
}
