'use server';
import { randomPerson } from "./tmdb.service";

let dailyCostars: DailyCostars = {
  target: {} as GameEntity,
  starter: {} as GameEntity
};

export const fetchDailyCostars = async () => {
  console.log("----- Refreshing Daily Costars -----")

  const target = await randomPerson();
  const targetSet = new Set(target.credits);

  let starter = await randomPerson();

  while (starter.credits!.some(c => targetSet.has(c))) {
    starter = await randomPerson();
  }

  console.log("----- Finished Refreshing -----")
  dailyCostars =  {
    target,
    starter
  };
};

fetchDailyCostars();

export const getDaily = async () => {
  console.log("Getting daily costars");
  console.log(JSON.stringify(dailyCostars));
  return dailyCostars;
}