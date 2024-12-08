import GameContainer from "@/components/game/game-container";
import { getDailyCostars } from "@/services/cache.service";

export default async function DailyGame() {
  const { target, starter, solutions } = await getDailyCostars();

  return (
    <GameContainer initPeople={[target, starter]} daily dailySolutions={solutions} />
  );
}