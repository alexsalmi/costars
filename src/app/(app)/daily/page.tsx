import GameContainer from "@/components/game/game-container";
import { getDaily } from "@/services/scheduler.service";

export default async function DailyGame() {
  const { target, starter } = await getDaily();

  return (
    <GameContainer initPeople={[target, starter]} />
  );
}