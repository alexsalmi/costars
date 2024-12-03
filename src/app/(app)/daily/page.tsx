import GameContainer from "@/components/game/game-container";
import { getDailyCostars } from "@/services/cache.service";

export default async function DailyGame() {
  const { target, starter } = await getDailyCostars();

  return (
    <GameContainer initPeople={[target, starter]} daily />
  );
}