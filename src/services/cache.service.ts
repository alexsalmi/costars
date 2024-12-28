'use server'
import { unstable_cache } from 'next/cache';
import { getCredits, getTrending } from "./tmdb.service";
import { supabase_getDailyCostarsByDate, supabase_getDailySolutions } from './supabase.service';

export const getRandomPerson = async () => {
  const pool = await getRandomPool();

  return pool[Math.floor(Math.random() * pool.length)];
}

export const getRandomPool = unstable_cache(async () => {
  console.log("----- Refreshing Random Pool -----");
  const POOL_SIZE = 200;
  const pool = [] as Array<GameEntity>;

  let page = 1;
  let iteration = 0;

  while (pool.length < POOL_SIZE && iteration < 100) {
    const trending = (await getTrending(page))
      .filter(person => 
        person.popularity > 30 &&
        person.known_for_department === 'Acting'
      );

    const promises = [] as Array<Promise<Array<MovieCredit>>>;

    for(const person of trending)
      promises.push(getCredits(person.id, 'person') as Promise<Array<MovieCredit>>);

    const creditsArr = await Promise.all(promises);

    const entities = [] as Array<GameEntity>;

    for(let i=0; i<trending.length; i++){
      const isMostlyEnglish = creditsArr[i].reduce(
        (acc, credit) => acc + (credit.original_language === 'en' ? 1 : 0),
        0
      ) >= Math.floor(creditsArr[i].length / 2);

      if(!isMostlyEnglish || creditsArr[i].length < 10)
        continue;

      entities.push({
        type: 'person',
        id: trending[i].id,
        label: trending[i].name,
        image: trending[i].profile_path,
        credits: creditsArr[i].map(credit => credit.id),
        popularity: trending[i].popularity
      });
    }

    pool.push(...entities);
    console.log("Pool size: " + pool.length);
    page++;
    iteration++;
  }

  console.log(`------- Random Pool has ${pool.length} people --------`);
  console.log("----- Finished Refreshing Random Pool -----\n");
  return pool;
}, [], { tags: ['random_pool'] });

export const getTodaysCostars = unstable_cache(async () => {
  console.log("TODAYS COSTARS")
  return supabase_getDailyCostarsByDate(new Date());
}, [], { tags: ['daily_costars'] }); 


export const getTodaysSolutions = unstable_cache(async () => {
  console.log("TODAYS SOLUTIONS")
  return supabase_getDailySolutions((await supabase_getDailyCostarsByDate(new Date())).id || 0);
}, [], { tags: ['daily_costars'] }); 

export const getYesterdaysCostars = unstable_cache(async () => {
  console.log("YESTERDAYS COSTARS")
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() + 1);
  return supabase_getDailyCostarsByDate(yesterday);
}, [], { tags: ['daily_costars'] }); 


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
  let solutions = null as OptimalSolutions | null;

  do {
    do {
      starter = await getRandomPerson();
    } while(actorSet.has(starter.id))

    solutions = await(getOptimalSolutions(starter, target));
  } while (solutions === null)

  console.log(`----- Newly generated costars are ${target.label} and ${starter.label} -----`);
  console.log("----- Finished Generating New Costars -----\n");

  return {
    target,
    starter,
    solutions
  };
};

interface OptimalSolutions {
  solutions: Array<Array<GameEntity>>,
  total_count: number
}

export const getOptimalSolutions = async (person1: GameEntity, person2: GameEntity)
    : Promise<OptimalSolutions | null> => {
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

    if(level > 2 && solutions.length === 0)
      break;
  }

  if (level !== 2)
    return null;

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
    total_count: solutions.length,
    solutions: best_solutions
  }
}

const getCreditEntities = async (id: number, type: TmdbType, path: Array<GameEntity>, queue: Array<OptimalQueueValue>) => {
  await getCredits(id, type)
    .then(credits => {
      if(!credits){
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
