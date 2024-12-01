'use server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { randomPerson } from "./tmdb.service";
import cron from 'node-cron';

const fetchDailyCostars = async () => {
  console.log("----- Refreshing Daily Costars -----")
  const dailyCostars: DailyCostars = {
    target: (await randomPerson()),
    starter:  (await randomPerson())
  };
  const targetSet = new Set(dailyCostars.target.credits);

  while (dailyCostars.starter.credits!.some(c => targetSet.has(c))) {
    dailyCostars.starter = await randomPerson();
  }

  console.log("----- Finished Refreshing -----")

  return dailyCostars;
};

cron.schedule('* * * * *', async () => {
  console.log("Revalidating")
  revalidateTag('daily_costars');
});

export const getDaily = unstable_cache(fetchDailyCostars, ['daily_costars'], { revalidate: false, tags: ['daily_costars'] });
