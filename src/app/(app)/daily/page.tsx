import GameContainer from "@/components/game/game-container";
import { getTodaysCostars } from "@/services/cache.service";

export default async function DailyGame() {
  const daily = await getTodaysCostars();

  return (
    <GameContainer initPeople={[daily.target, daily.starter]} daily={true} />
  );
}