'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { randomPerson } from "./tmdb.service";
import cron from 'node-cron';

const fetchDailyCostars = unstable_cache(async () => {
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
}, ['daily_costars'], {tags: ['daily_costars']});

cron.schedule('* * * * *', async () => {
  console.log("Revalidating")
  revalidateTag('daily_costars');
  revalidatePath('/');
  revalidatePath('/daily');
});

export const getDaily = async () => {    
  return fetchDailyCostars();
}