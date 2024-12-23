export function isToday (date: Date) { 
  const today = new Date();

  return date.getUTCDate() === today.getUTCDate() &&
        date.getUTCMonth() === today.getUTCMonth() &&
        date.getUTCFullYear() === today.getUTCFullYear()
}

export function getDayNumber (date: string) {
  return Math.floor((new Date(date!).getTime() - new Date("12/31/2024").getTime()) / (1000 * 60 * 60 * 24));
}

export function getScoreString (history: Array<GameEntity>, hints: Array<Hint>) {
  let str = '';

  for(const entity of history){
    if(entity.type === 'movie')
      str += '🎬';

    if(hints.some(hint => hint.id === entity.id && hint.type === entity.type))
      str += '❓'; 
  }

  return str;
}
