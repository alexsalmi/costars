import { createBrowserClient } from "@supabase/ssr"

export function isToday (date: Date) { 
  const today = new Date()

  return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
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

export const getUserFromClient = async () => {
  const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return null;
  }
  
  return data.user;
}