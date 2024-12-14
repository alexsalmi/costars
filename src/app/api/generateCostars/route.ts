import { getCostars } from '@/services/cache.service';
import { saveCostars } from '@/services/db.service';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production' && 
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ok: false}, {status: 401, statusText: "Unauthorized"});
  }

  console.log("----- GETTING NEW COSTARS -----");
  let costars = [] as Array<DailyCostars>;
  const actorSet = new Set<number>();

  while (costars.length < 7) {
    const newCostars = await getCostars(actorSet);

    actorSet.add(newCostars.starter.id);
    actorSet.add(newCostars.target.id);

    newCostars.starter = {
      ...newCostars.starter,
      popularity: undefined
    }

    newCostars.target = {
      ...newCostars.target,
      popularity: undefined
    }

    costars.push(newCostars);
  }

  // Sort the costars pairings by the total popularity score of all their top 10 optimal solutions
  costars = costars.sort((a, b) => 
    b.solutions.mostPopular.reduce((acc, solution) => acc +
      solution.reduce((acc2, entity) => acc2 + (entity.popularity || 0), 0), 0)
    -
    a.solutions.mostPopular.reduce((acc, solution) => acc +
      solution.reduce((acc2, entity) => acc2 + (entity.popularity || 0), 0), 0)
  );

  console.log("----- Saving costars to DB -----");
  await saveCostars(costars);

  console.log("----- FINISHED GETTING NEW COSTARS -----");

  return NextResponse.json({ok: true});
}
