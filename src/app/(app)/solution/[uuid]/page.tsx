import CardTrack from "@/components/presentation/card-track";
import { getSolution } from "@/services/db.service";
import '@/styles/pages/solution.scss';

interface ICustomGameProps {
  params: Promise<{ uuid: string }>
}

export default async function CustomGame({ params }: ICustomGameProps) {
  const uuid = (await params).uuid;

  const solution = await getSolution(uuid);

  return (
    <div className="solution-page-container">
      <h3>{"Here's"} my solution:</h3>
      <CardTrack cards={solution}/>
    </div>
  );
}