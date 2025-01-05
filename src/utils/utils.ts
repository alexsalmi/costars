import { getUserDailySolutions } from '@/services/userdata.service';

export function getDayNumber(date: string) {
  return Math.floor(
    (new Date(date).getTime() - new Date('12/31/2024').getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function getScoreString(history: Array<GameEntity>, hints: Array<Hint>) {
  let str = '';

  for (const entity of history) {
    if (entity.type === 'movie') str += '🎬';

    if (
      hints.some((hint) => hint.id === entity.id && hint.type === entity.type)
    )
      str += '❓';
  }

  return str;
}

export function getUserSolution(daily_id: number): Solution | null {
  const userDailySolutions = getUserDailySolutions();

  const solution = userDailySolutions.find((sol) => sol.daily_id === daily_id);

  return solution || null;
}
export function getFormattedDateString(dateStr: string) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
