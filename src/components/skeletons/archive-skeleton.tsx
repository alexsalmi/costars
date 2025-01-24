import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { StarBorderOutlined, Star } from '@mui/icons-material';
import '@/styles/game/archive.scss';

export default function CSArchiveSkeleton() {
  return (
    <div className='archive-container'>
      <h3>Archive</h3>
      <span>
        Select any day in the calendar to match an old pair of daily costars!
      </span>

      <DayCalendarSkeleton className='archive-calendar skeleton' />

      <span className='archive-legend'>
        <span className={`archive-day-icon completed`}>
          <Star />
        </span>
        <span>= Perfect Game</span>
        <div style={{ width: '20px' }}></div>
        <span className={`archive-day-icon completed`}>
          <StarBorderOutlined />
        </span>
        <span>= Completed</span>
      </span>
    </div>
  );
}
