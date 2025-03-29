import CSGameContainer from '@/components/game/game-container';
import { getTodaysCostars, getTodaysSolutions } from '@/services/cache.service';

export default async function DailyGame() {
  const [daily, solutions] = await Promise.all([getTodaysCostars(), getTodaysSolutions()]);
  
  if (!daily || !solutions) throw Error('Error getting Costars');

  return (
    <CSGameContainer
      type='daily'
      initPeople={[daily.target, daily.starter]}
      daily={daily}
      solutions={solutions}
    />
  );
}
