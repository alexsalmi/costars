import { unstable_cache } from 'next/cache';
import { randomPerson, getPerson } from "./tmdb.service";

const daily: DailyCostars = {
  target: await randomPerson().then(res => getPerson(res.id)),
  starter: await randomPerson().then(res => getPerson(res.id))
}

export const getDaily = unstable_cache(
  async () => { return daily; },
  [],
  { revalidate: 86400}
);