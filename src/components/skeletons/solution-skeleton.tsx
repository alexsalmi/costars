import CSBackButton from '../inputs/buttons/back-button';
import CardTrack from '../presentation/card-track';
import '@/styles/pages/solution.scss';

export default function CSSolutionSkeleton() {
  return (
    <>
      <CSBackButton />
      <div className='solution-page-container skeleton'>
        <h3>Loading...</h3>
        <CardTrack cards={[]} shimmer fullHeight />
      </div>
    </>
  );
}
