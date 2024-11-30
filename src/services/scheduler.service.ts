'use server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { randomPerson } from "./tmdb.service";
import cron from 'node-cron';

const daily: DailyCostars = {
  target: {} as GameEntity,
  starter: {} as GameEntity
};

const refreshDailyCostars = async () => {
  console.log("----- Refreshing Daily Costars -----")
  daily.target = await randomPerson();
  const targetSet = new Set(daily.target.credits);

  do {
    daily.starter = await randomPerson();
  } while (daily.starter.credits!.some(c => targetSet.has(c)));

  revalidateTag('daily_costars');
};

cron.schedule('0 0 * * *', async () => {
  await refreshDailyCostars();
});

export const getDaily = unstable_cache(
  async () => { return daily; },
  [],
  {
    tags: ['daily_costars']
  }
);

refreshDailyCostars();