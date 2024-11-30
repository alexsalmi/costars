import { getPerson } from "@/services/tmdb.service";
import GameContainer from "@/components/game/game-container";

interface ICustomGameProps {
  params: Promise<{ ids: string }>
}

export default async function CustomGame({ params }: ICustomGameProps) {
  const ids = (await params).ids.split("..");

  if (ids.length !== 2 || parseInt(ids[0], 36) == parseInt(ids[1], 36))
    throw Error("Invalid URL");

  const targetId = parseInt(ids[0], 36);
  const startId = parseInt(ids[1], 36);
    
  const [target, start] = await Promise.all([getPerson(targetId), getPerson(startId)]);

  if (target.known_for_department !== 'Acting' || start.known_for_department !== 'Acting')
    throw Error("Invalid people");

  return (
    <GameContainer initPeople={[target, start]} />
  );
}