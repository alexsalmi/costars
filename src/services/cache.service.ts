'use server'

import { unstable_cache } from 'next/cache';
import { getCredits, getTrending } from "./tmdb.service";

export const getDailyCostars = unstable_cache(async () => {
  console.log("----- Refreshing Daily Costars -----");

  pool = await getRandomPool();

  const target = await getRandomPerson();
  const targetSet = new Set(target.credits);

  let starter = await getRandomPerson();

  while (starter.credits!.some(c => targetSet.has(c))) {
    starter = await getRandomPerson();
  }

  console.log(`----- New daily costars are ${target.label} and ${starter.label} -----`);
  console.log("----------------- Finished Refreshing Daily Costars ------------------");

  return {
    target,
    starter
  };
}, ['daily_costars'], {tags: ['daily_costars']});


export const getRandomPool = unstable_cache(async () => {
  console.log("----- Refreshing Random Pool -----");
  const POOL_SIZE = 100;
  const pool = [] as Array<GameEntity>;

  let page = 1;

  while(pool.length < POOL_SIZE) {
    const trending = (await getTrending(page))
      .filter(person => 
        person.popularity > 30 &&
        person.known_for_department === 'Acting'
      );

    const promises = [] as Array<Promise<TmdbCreditsResult<MovieCredit>>>;

    for(const person of trending)
      promises.push(getCredits(person.id, 'person') as Promise<TmdbCreditsResult<MovieCredit>>);

    const creditsArr = await Promise.all(promises);

    const entities = [] as Array<GameEntity>;

    for(let i=0; i<trending.length; i++){
      const isMostlyEnglish = creditsArr[i].cast.reduce(
        (acc, credit) => acc + (credit.original_language === 'en' ? 1 : 0),
        0
      ) >= Math.floor(creditsArr[i].cast.length / 2);

      if(!isMostlyEnglish)
        continue;

      entities.push({
        type: 'person',
        id: trending[i].id,
        label: trending[i].name,
        image: trending[i].profile_path,
        credits: creditsArr[i].cast.map(credit => credit.id)
      });
    }

    pool.push(...entities);
    console.log("Pool size: " + pool.length);
    page++;
  }

  console.log(`------- Random Pool has ${pool.length} people --------`);
  console.log("----- Finished Refreshing Random Pool -----");
  return pool;
}, ['random_pool'], {tags: ['random_pool']});


let pool = await getRandomPool();

export const getRandomPerson = async () => {
  return pool[Math.floor(Math.random() * pool.length)];
}