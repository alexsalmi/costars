import '@/styles/presentation/daily-costars.scss';
import CSButton from '../inputs/buttons/button';
import CSEntityImageSkeleton from './entity-image-skeleton';

export default async function CSDailyCostarsSkeleton() {
  return (
    <div className='daily-costars-container skeleton'>
      <h3 className='daily-costars-header'>Daily Costars</h3>
      <div className='daily-costars-previews'>
        <CSEntityImageSkeleton />
        <div className='daily-costars-names skeleton'>
          <span>Nobody</span>
          <span>to</span>
          <span>Nobody</span>
        </div>
        <CSEntityImageSkeleton />
      </div>
      <CSButton disabled>Play!</CSButton>
    </div>
  );
}
