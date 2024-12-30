import { getCostars } from '@/services/cache.service';
import { supabase_saveCostars } from '@/services/supabase.service';
import { getDayNumber } from '@/utils/utils';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { ok: false },
      { status: 401, statusText: 'Unauthorized' },
    );
  }

  console.log('----- GETTING NEW COSTARS -----');
  let costars = [] as Array<NewDailyCostars>;
  const actorSet = new Set<number>();

  let day = 0;
  while (day < 7) {
    const newCostars = await getCostars(actorSet);

    actorSet.add(newCostars.starter.id);
    actorSet.add(newCostars.target.id);

    const date = new Date();
    date.setDate(date.getDate() + 7 + day);
    date.setHours(0, 0, 0, 0);

    costars.push({
      starter: newCostars.starter,
      target: newCostars.target,
      num_solutions: newCostars.solutions.total_count,
      date: date.toISOString(),
      day_number: getDayNumber(date.toISOString()),
      solutions: newCostars.solutions.solutions,
    });

    day++;
  }

  // Sort the costars pairings by the total popularity score of all their top 10 optimal solutions
  costars = costars.sort(
    (a, b) =>
      b.solutions.reduce(
        (acc, solution) =>
          acc +
          solution.reduce((acc2, entity) => acc2 + (entity.popularity || 0), 0),
        0,
      ) -
      a.solutions.reduce(
        (acc, solution) =>
          acc +
          solution.reduce((acc2, entity) => acc2 + (entity.popularity || 0), 0),
        0,
      ),
  );

  console.log('----- Saving costars to DB -----');

  for (const dailyCostars of costars) {
    await supabase_saveCostars(dailyCostars);
  }

  revalidatePath('/admin');

  console.log('----- FINISHED GETTING NEW COSTARS -----');

  return NextResponse.json({ ok: true });
}
