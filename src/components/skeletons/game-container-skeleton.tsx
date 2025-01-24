import CSCardTrack from '@/components/presentation/card-track';
import CSTextDisplay from '@/components/presentation/display';
import CSBackButton from '../inputs/buttons/back-button';
import '@/styles/game/game-container.scss';
import CSToolbarSkeleton from './toolbar-skeleton';
import CSSearchBarSkeleton from './search-bar-skeleton';

export default function CSGameContainerSkeleton() {
  return (
    <div className='game-container skeleton'>
      <CSBackButton />
      <CSSearchBarSkeleton />
      <div className='game-scores skeleton'>
        <CSTextDisplay> </CSTextDisplay>
      </div>
      <div className='game-card-section'>
        <CSToolbarSkeleton />
        <CSCardTrack cards={[]} shimmer />
      </div>
    </div>
  );
}
