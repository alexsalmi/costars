import GameContainer from "@/components/game/game-container";
import { getTodaysCostars } from "@/services/cache.service";

export default async function DailyGame() {
  const { target, starter, solutions } = await getTodaysCostars();

  return (
    <GameContainer initPeople={[target, starter]} daily dailySolutions={solutions} />
  );
}