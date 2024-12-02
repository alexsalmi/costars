'use server';
import { randomPerson } from "./tmdb.service";

export const fetchDailyCostars = async () => {
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

console.log("Scheduler service");

export const getDaily = async () => {
  console.log("Getting daily costars");

  return await fetchDailyCostars();
}