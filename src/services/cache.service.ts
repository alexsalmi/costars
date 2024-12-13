'use server'

import { unstable_cache } from 'next/cache';
import { getCredits, getTrending } from "./tmdb.service";


export const getRandomPerson = async () => {
  const pool = await unstable_cache(getRandomPool, [], { tags: ['random_pool'] })();

  return pool[Math.floor(Math.random() * pool.length)];
}

export const getRandomPool = async () => {
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
};
