import CSBackButton from '@/components/inputs/buttons/back-button';
import CardTrack from '@/components/presentation/card-track';
import supabaseService from '@/services/supabase';
import '@/styles/pages/solution.scss';

interface ISolutionProps {
  params: Promise<{ uuid: string }>;
}

export default async function Solution({ params }: ISolutionProps) {
  const uuid = (await params).uuid;

  const { solution, hints } = (
    await supabaseService.solutions.get({ uuid })
  )[0];

  return (
    <>
      <CSBackButton />
      <div className='solution-page-container'>
        <h3>{"Here's"} my solution:</h3>
        <CardTrack cards={solution} hints={hints} />
      </div>
    </>
  );
}
