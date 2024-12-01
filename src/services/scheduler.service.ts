'use server';
import { revalidatePath } from 'next/cache';
import { randomPerson } from "./tmdb.service";
import cron from 'node-cron';

const dailyCostars: DailyCostars = {
  target: {} as GameEntity,
  starter: {} as GameEntity
};

const refreshDailyCostars = async () => {
  console.log("----- Refreshing Daily Costars -----")
  dailyCostars.target = await randomPerson();
  const targetSet = new Set(dailyCostars.target.credits);

  do {
    dailyCostars.starter = await randomPerson();
  } while (dailyCostars.starter.credits!.some(c => targetSet.has(c)));
};

cron.schedule('* * * * *', async () => {
  await refreshDailyCostars();

  revalidatePath('/');
  revalidatePath('/daily');
});

refreshDailyCostars();

export const getDaily = async () => {    
  return dailyCostars;
}