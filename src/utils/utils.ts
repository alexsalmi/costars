import { createBrowserClient } from "@supabase/ssr"

export function isToday (date: Date) { 
  const today = new Date()

  return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}

export function isYesterday (date: Date) { 
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
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