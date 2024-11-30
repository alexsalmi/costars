import { unstable_cache } from 'next/cache';
import { randomPerson } from "./tmdb.service";

const daily: DailyCostars = {
  target: await randomPerson(),
  starter: await randomPerson()
}

export const getDaily = unstable_cache(
  async () => { return daily; },
  [],
  { revalidate: 86400}
);