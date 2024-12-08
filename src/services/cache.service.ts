'use server'

import { unstable_cache } from 'next/cache';
import { getCredits, getTrending } from "./tmdb.service";

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

export const getRandomPerson = async () => {
  return pool[Math.floor(Math.random() * pool.length)];
}

export const getDailyCostars = unstable_cache(async () => {
  console.log("----- Refreshing Daily Costars -----");

  pool = await getRandomPool();

  const target = await getRandomPerson();

  let starter = {} as GameEntity;
  let solutions = {} as DailySolutions;

  do {
    starter = await getRandomPerson();
    solutions = await(getOptimalSolutions(target, starter));
  } while (solutions.score !== 2)

  console.log(`----- New daily costars are ${target.label} and ${starter.label} -----`);
  console.log("----- Finished Refreshing Daily Costars -----\n");

  return {
    target,
    starter,
    solutions
  };
}, ['daily_costars'], {tags: ['daily_costars']});


export const getRandomPool = unstable_cache(async () => {
  console.log("----- Refreshing Random Pool -----");
  const POOL_SIZE = 200;
  const pool = [] as Array<GameEntity>;

  let page = 1;

  while(pool.length < POOL_SIZE) {
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
        credits: creditsArr[i].map(credit => credit.id)
      });
    }

    pool.push(...entities);
    console.log("Pool size: " + pool.length);
    page++;
  }

  console.log(`------- Random Pool has ${pool.length} people --------`);
  console.log("----- Finished Refreshing Random Pool -----\n");
  return pool;
}, ['random_pool'], {tags: ['random_pool']});

let pool = await getRandomPool();


const getOptimalSolutions = async (person1: GameEntity, person2: GameEntity)
    : Promise<DailySolutions> => {
  console.log("----- Getting Optimal Solutions -----");
  let solutions = [] as Array<Array<GameEntity>>;
  let level = 0;

  const leftQueue: Array<OptimalQueueValue> = [{entity: person1, path: []}];
  const rightQueue: Array<OptimalQueueValue> = [{entity: person2, path: []}];
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
