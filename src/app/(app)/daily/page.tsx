import CSGameContainer from '@/components/game/game-container';
import { getTodaysCostars, getTodaysSolutions } from '@/services/cache.service';

export default async function DailyGame() {
  const daily = await getTodaysCostars();
  const solutions = await getTodaysSolutions();

  return (
    <CSGameContainer
      initPeople={[daily.target, daily.starter]}
      daily={daily}
      solutions={solutions}
    />
  );
}
