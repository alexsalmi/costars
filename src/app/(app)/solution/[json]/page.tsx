import CardTrack from "@/components/presentation/card-track";
import '@/styles/pages/solution.scss';

interface ICustomGameProps {
  params: Promise<{ json: string }>
}

export default async function CustomGame({ params }: ICustomGameProps) {
  const json = (await params).json;

  const solution: Array<GameEntity> = JSON.parse(atob(json));

  return (
    <div className="solution-page-container">
      <h3>{"Here's"} my solution:</h3>
      <CardTrack cards={solution}/>
    </div>
  );
}