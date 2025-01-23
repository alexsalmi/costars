import Solution from '@/components/game/solution';
import { sb_GetDailyCostars, sb_GetSolutions } from '@/services/supabase';
import '@/styles/pages/solution.scss';

interface ISolutionProps {
  params: Promise<{ uuid: string }>;
}

export default async function SolutionPage({ params }: ISolutionProps) {
  const { uuid } = await params;

  const solutions = await sb_GetSolutions({ uuid });

  if (!solutions || solutions.length === 0) throw Error('Invalid solution');

  const { solution, hints, daily_id } = solutions[0];
  let daily: DailyCostars | undefined;

  if (daily_id) daily = (await sb_GetDailyCostars({ id: daily_id }))![0];

  return <Solution solution={solution} hints={hints || []} daily={daily} />;
}
