import GameContainer from "@/components/game/game-container";
import { supabase_getDailyCostarsByDayNumber, supabase_getDailySolutions } from "@/services/supabase.service";
import { getTodaysCostars } from "@/services/cache.service";

interface IDailyArchiveGameProps {
  params: Promise<{ day_number: string }>
}

export default async function DailyArchiveGame({ params }: IDailyArchiveGameProps) {
  let day_number: number

  try {
    day_number = parseInt((await params).day_number);
  }
  catch {
    throw Error("Invalid URL");
  }
    
  const [todays, daily] = await Promise.all([
    getTodaysCostars(),
    supabase_getDailyCostarsByDayNumber(day_number)
  ]);
  if (!daily || todays.day_number <= daily.day_number)
    throw Error("Invalid URL");
    
  const solutions = await supabase_getDailySolutions(daily.id!);

  return (
    <GameContainer initPeople={[daily.target, daily.starter]} daily={daily} solutions={solutions} archive={true} />
  );
}