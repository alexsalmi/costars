import {
  sb_GetDailyCostars,
  sb_PostDailyCostars,
  sb_PostSolutions,
} from '@/services/supabase';
import { getCostars, getPairingString } from '@/utils/costars';
import { getDayNumber } from '@/utils/utils';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { ok: false },
      { status: 401, statusText: 'Unauthorized' },
    );
  }

  console.log('----- GETTING NEW COSTARS -----');
  let costars = [] as Array<NewDailyCostars>;

  const previousCostars = (await sb_GetDailyCostars({}))?.reverse();
  const previousPairs = previousCostars?.map((cs) =>
    getPairingString(cs.starter, cs.target),
  );

  const pairingSet = new Set(previousPairs);
  const actorSet = new Set<number>();

  let ind = 0;
  while (previousCostars && ind < 50 && ind < previousCostars.length) {
    const cs = previousCostars[ind];
    actorSet.add(cs.starter.id);
    actorSet.add(cs.target.id);

    ind++;
  }

  let day = 0;
  while (day < 7) {
    const newCostars = await getCostars(actorSet, pairingSet);

    actorSet.add(newCostars.starter.id);
    actorSet.add(newCostars.target.id);

    pairingSet.add(getPairingString(newCostars.starter, newCostars.target));

    costars.push({
      starter: newCostars.starter,
      target: newCostars.target,
      num_solutions: newCostars.solutions.total_count,
      date: '',
      day_number: 0,
      solutions: newCostars.solutions.solutions,
    });

    day++;
  }

  // Sort the costars pairings by the number of solutions
  costars = costars.sort((a, b) => b.num_solutions - a.num_solutions);

  console.log('----- Saving costars to DB -----');

  for (let ind = 0; ind < costars.length; ind++) {
    const dailyCostars = costars[ind];

    const date = new Date();
    date.setDate(date.getDate() + 7 + ind);
    date.setHours(0, 0, 0, 0);

    const newCostars: DailyCostars = {
      starter: dailyCostars.starter,
      target: dailyCostars.target,
      num_solutions: dailyCostars.num_solutions,
      date: date.toISOString(),
      day_number: getDayNumber(date.toISOString()),
    };

    const daily_id = await sb_PostDailyCostars(newCostars);

    if (!daily_id) continue;

    const solutions: Array<Solution> = dailyCostars.solutions.map((sol) => ({
      daily_id,
      solution: sol,
      is_daily_optimal: true,
    }));

    await sb_PostSolutions(solutions);
  }

  revalidatePath('/admin');

  console.log('----- FINISHED GETTING NEW COSTARS -----');

  return NextResponse.json({ ok: true });
}
