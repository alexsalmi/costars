import CSBackButton from "@/components/inputs/back-button";
import CardTrack from "@/components/presentation/card-track";
import { getSolution } from "@/services/supabase.service";
import '@/styles/pages/solution.scss';

interface ICustomGameProps {
  params: Promise<{ uuid: string }>
}

export default async function CustomGame({ params }: ICustomGameProps) {
  const uuid = (await params).uuid;

  const { solution, hints } = await getSolution(uuid);

  return (
    <>
      <CSBackButton/>
      <div className="solution-page-container">
        <h3>{"Here's"} my solution:</h3>
        <CardTrack cards={solution} hints={hints} />
      </div>
    </>
  );
}