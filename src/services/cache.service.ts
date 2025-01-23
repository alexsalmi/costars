'use server';
import { unstable_cache } from 'next/cache';
import { getCredits, getTrending } from './tmdb.service';
import { sb_GetDailyCostars, sb_GetSolutions } from './supabase';

export const getRandomPool = unstable_cache(
  async () => {
    console.log('----- Refreshing Random Pool -----');
    const POOL_SIZE = 200;
    const pool = [] as Array<GameEntity>;

    let page = 1;
    let iteration = 0;

    while (pool.length < POOL_SIZE && iteration < 100) {
      const trending = (await getTrending(page)).filter(
        (person) =>
          person.popularity > 30 && person.known_for_department === 'Acting',
      );

      const promises = [] as Array<Promise<Array<MovieCredit>>>;

      for (const person of trending)
        promises.push(
          getCredits(person.id, 'person') as Promise<Array<MovieCredit>>,
        );

      const creditsArr = await Promise.all(promises);

      const entities = [] as Array<GameEntity>;

      for (let i = 0; i < trending.length; i++) {
        const isMostlyEnglish =
          creditsArr[i].reduce(
            (acc, credit) => acc + (credit.original_language === 'en' ? 1 : 0),
            0,
          ) >= Math.floor(creditsArr[i].length / 2);

        if (!isMostlyEnglish || creditsArr[i].length < 10) continue;

        entities.push({
          type: 'person',
          id: trending[i].id,
          label: trending[i].name,
          image: trending[i].profile_path,
          popularity: trending[i].popularity,
        });
      }

      pool.push(...entities);
      console.log('Pool size: ' + pool.length);
      page++;
      iteration++;
    }

    console.log(`------- Random Pool has ${pool.length} people --------`);
    console.log('----- Finished Refreshing Random Pool -----\n');
    return pool;
  },
  [],
  { tags: ['random_pool'] },
);

export const getTodaysCostars = unstable_cache(
  async () => {
    console.log('TODAY');
    const forCache = true;
    const costars = await sb_GetDailyCostars(
      {
        date: new Date().toLocaleString(),
      },
      forCache,
    );

    if (!costars) return null;

    const todaysCostars = costars[0];

    const [starterCredits, targetCredits] = await Promise.all([
      getCredits(todaysCostars.starter.id, 'person'),
      getCredits(todaysCostars.target.id, 'person'),
    ]);

    todaysCostars.starter.credits = starterCredits.map((credit) => credit.id);
    todaysCostars.target.credits = targetCredits.map((credit) => credit.id);

    return todaysCostars;
  },
  [],
  { tags: ['daily_costars'] },
);

export const getTodaysSolutions = unstable_cache(
  async () => {
    const forCache = true;
    const costars = await sb_GetDailyCostars(
      {
        date: new Date().toLocaleString(),
      },
      forCache,
    );

    if (!costars) return [];

    return await sb_GetSolutions(
      {
        is_daily_optimal: true,
        daily_id: costars[0].id,
      },
      forCache,
    );
  },
  [],
  { tags: ['daily_costars'] },
);

export const getYesterdaysCostars = unstable_cache(
  async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const forCache = true;
    const costars = await sb_GetDailyCostars(
      {
        date: yesterday.toLocaleString(),
      },
      forCache,
    );

    if (!costars) return null;
    return costars[0];
  },
  [],
  { tags: ['daily_costars'] },
);

export const getCostarsByDayNumber = unstable_cache(
  async (day_number: number) => {
    const forCache = true;
    const costars = await sb_GetDailyCostars({ day_number }, forCache);

    if (!costars) return null;

    const daysCostars = costars[0];

    const [starterCredits, targetCredits] = await Promise.all([
      getCredits(daysCostars.starter.id, 'person'),
      getCredits(daysCostars.target.id, 'person'),
    ]);

    daysCostars.starter.credits = starterCredits.map((credit) => credit.id);
    daysCostars.target.credits = targetCredits.map((credit) => credit.id);

    return daysCostars;
  },
  [],
  { tags: ['daily_costars'] },
);

export const getDailySolutions = unstable_cache(
  async (daily_id: number) => {
    const forCache = true;
    return await sb_GetSolutions(
      {
        is_daily_optimal: true,
        daily_id,
      },
      forCache,
    );
  },
  [],
  { tags: ['daily_costars'] },
);

export const getMonthsCostars = unstable_cache(async () => {
  const date = new Date();

  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setDate(1);
  end.setMonth(end.getMonth() + 1);
  end.setHours(0, 0, 0, 0);

  const forCache = true;
  return await sb_GetDailyCostars(
    {
      after_date: start.toISOString(),
      before_date: end.toISOString(),
    },
    forCache,
  );
});

export const getDailyCostarsByMonth = unstable_cache(
  async (month: number, year: number) => {
    const date = new Date(`${year}/${month}/01`);

    const start = new Date(date);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setHours(0, 0, 0, 0);

    const forCache = true;
    return await sb_GetDailyCostars(
      {
        after_date: start.toISOString(),
        before_date: end.toISOString(),
      },
      forCache,
    );
  },
  [],
  { tags: ['daily_costars'] },
);
