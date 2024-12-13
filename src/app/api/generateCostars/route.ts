import { getRandomPerson } from '@/services/cache.service';
import { saveCostars } from '@/services/db.service';
import { getCredits } from '@/services/tmdb.service';
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


interface OptimalQueueValue {
  entity: GameEntity,
  path: Array<GameEntity>
}

interface OptimalMapKey {
  id: number,
  type: TmdbType
}

interface OptimalMapValue {
  path: Array<GameEntity>,
  level: number
}

const OptimalMap = Map<string, OptimalMapValue>;

export const getCostars = async (actorSet: Set<number>) => {
  console.log("----- Generating New Costars -----");

  let target = {} as GameEntity;

  do {
    target = await getRandomPerson();
  } while(actorSet.has(target.id))

  let starter = {} as GameEntity;
  let solutions = {} as DailySolutions;

  do {
    do {
      starter = await getRandomPerson();
    } while(actorSet.has(starter.id))

    solutions = await(getOptimalSolutions(starter, target));
  } while (solutions.score !== 2)

  console.log(`----- Newly generated costars are ${target.label} and ${starter.label} -----`);
  console.log("----- Finished Generating New Costars -----\n");

  return {
    target,
    starter,
    solutions
  };
};

const getOptimalSolutions = async (person1: GameEntity, person2: GameEntity)
    : Promise<DailySolutions> => {
  console.log("----- Getting Optimal Solutions -----");
  let solutions = [] as Array<Array<GameEntity>>;
  let level = 0;

  const leftQueue: Array<OptimalQueueValue> = [{ entity: { ...person1, credits: undefined }, path: []}];
  const rightQueue: Array<OptimalQueueValue> = [{ entity: { ...person2, credits: undefined }, path: []}];
  const leftMap = new OptimalMap(), rightMap = new OptimalMap();

  while(solutions.length === 0) {
    let promises: Array<Promise<void>> = [];

    // Check for solution on left side
    for(const { entity, path } of leftQueue) {
      const key = JSON.stringify({id: entity.id, type: entity.type} as OptimalMapKey);

      if(rightMap.has(key)){
        solutions.push([...path, entity, ...rightMap.get(key)!.path]);
        continue;
      }
      
      if(leftMap.has(key))
        continue;

      leftMap.set(key, {
        path,
        level
      });
    }

    // Check for solution on left side
    for(const { entity, path } of rightQueue) {
      const key = JSON.stringify({id: entity.id, type: entity.type} as OptimalMapKey);

      if(leftMap.has(key)){
        solutions.push([...leftMap.get(key)!.path, entity, ...path]);
        continue;
      }
      
      if(rightMap.has(key))
        continue;

      rightMap.set(key, {
        path,
        level
      });
    }

    // If we've found a solution, exit the loop
    if(solutions.length > 0)
      break;
    
    // Get the next level of credits for the left side
    const leftLen = leftQueue.length;
    for(let i=0; i<leftLen; i++) {
      const { entity, path } = leftQueue.pop() as OptimalQueueValue;
      
      const promise: Promise<void> = getCreditEntities(entity.id, entity.type, [...path, entity], leftQueue);
      
      promises.push(promise);

      if(promises.length > 50){
        await Promise.all(promises);
        promises = [];
      }
    }
    
    await Promise.all(promises);
    promises = [];

    // Get the next level of credits for the right side
    const rightLen = rightQueue.length;
    for(let i=0; i<rightLen; i++) {
      const { entity, path } = rightQueue.pop() as OptimalQueueValue;
      
      const promise: Promise<void> = getCreditEntities(entity.id, entity.type, [entity, ...path], rightQueue);
      
      promises.push(promise);

      if(promises.length > 50){
        await Promise.all(promises);
        promises = [];
      }
    }

    await Promise.all(promises);

    level++;

    if(level === 3 && solutions.length === 0){
      level = -1;
      break;
    }
  }

  // Filter out any solutions longer than optimal, and sort by total popularity
  solutions = solutions.filter(solution => solution.length === ((level*2)+1))
    .sort((a, b) => 
      b.reduce((acc, curr) => acc + (curr?.popularity || 0), 0) - a.reduce((acc, curr) => acc + (curr?.popularity || 0), 0)
    );

  // Get 10 solutions with all unique movies, to avoid repitition
  const MAX = 10;
  const best_solutions: GameEntity[][] = [];
  const movies = new Set();
  for(const solution of solutions) {
    const movie_ids = solution.filter(s => s.type === 'movie').map(s => s.id);

    if(movie_ids.some(m => movies.has(m)))
      continue;

    best_solutions.push(solution);

    for(const id of movie_ids)
      movies.add(id);

    if(best_solutions.length === MAX)
      break;
  }

  console.log(`----- There are ${solutions.length} optimal solutions, at ${level} movies -----`);
  console.log("----- Finished Getting Optimal Solutions -----\n");
  
  return {
    score: level,
    count: solutions.length,
    mostPopular: best_solutions
  }
}

const getCreditEntities = async (id: number, type: TmdbType, path: Array<GameEntity>, queue: Array<OptimalQueueValue>) => {
  await getCredits(id, type)
    .then(credits => {
      if(!credits){
        console.log("Credits undefined: " + JSON.stringify(credits))
        return [];
      }
      const entities = credits
        .map(credit => 
          ({
            entity: {
              type: type === 'person' ? 'movie': 'person' as TmdbType,
              id: credit.id,
              label: (<MovieCredit> credit).title || (<PersonCredit> credit).name,
              image: (<MovieCredit> credit).poster_path || (<PersonCredit> credit).profile_path,
              popularity: credit.popularity
            },
            path
          })
        );

        queue.push(...entities);
    });
}
