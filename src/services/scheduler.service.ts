'use server';
import { revalidatePath } from "next/cache";
import { randomPerson } from "./tmdb.service";
import cron from 'node-cron';

const fetchDailyCostars = async () => {
  console.log("----- Refreshing Daily Costars -----")

  const target = await randomPerson();
  const targetSet = new Set(target.credits);

  let starter = await randomPerson();

  while (starter.credits!.some(c => targetSet.has(c))) {
    starter = await randomPerson();
  }

  console.log("----- Finished Refreshing -----")
  return {
    target,
    starter
  };
};

let dailyCostars: DailyCostars = await fetchDailyCostars();

cron.schedule('* * * * *', async () => {
  console.log("Revalidating")

  dailyCostars = await fetchDailyCostars();

  revalidatePath('/');
  revalidatePath('/daily');
});

export const getDaily = async () => {    
  return dailyCostars;
}