'use server';
import { createClient, createClientForCache } from '@/utils/supabase';
import { unstable_cache } from 'next/cache';

export const supabase_getDailyStats = async (
  user_id: string,
): Promise<DailyStats> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('DailyStats')
    .select()
    .eq('user_id', user_id);

  if (!data || data.length === 0) {
    const { data } = await supabase
      .from('DailyStats')
      .insert({
        user_id,
        days_played: 0,
        current_streak: 0,
        highest_streak: 0,
        optimal_solutions: 0,
      })
      .select();

    return data![0];
  }

  return data[0];
};

export const supabase_hasDailyStats = async (
  user_id: string,
): Promise<boolean> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('DailyStats')
    .select()
    .eq('user_id', user_id);

  return (data && data.length > 0) || false;
};

export const supabase_setDailyStats = async (dailyStats: DailyStats) => {
  const supabase = await createClient();

  return await supabase.from('DailyStats').insert(dailyStats);
};

export const supabase_updateDailyStats = async (dailyStats: DailyStats) => {
  const supabase = await createClient();

  return await supabase
    .from('DailyStats')
    .update(dailyStats)
    .eq('id', dailyStats.id);
};

export const supabase_getUnlimitedStats = async (
  user_id: string,
): Promise<UnlimitedStats> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('UnlimitedStats')
    .select()
    .eq('user_id', user_id);

  if (!data || data.length === 0) {
    const { data } = await supabase
      .from('UnlimitedStats')
      .insert({
        user_id,
        history: [],
        hints: [],
        high_score: 0,
      })
      .select();

    return data![0];
  }

  return data[0];
};

export const supabase_setUnlimitedStats = async (
  unlimitedStats: UnlimitedStats,
) => {
  const supabase = await createClient();

  return await supabase.from('UnlimitedStats').insert(unlimitedStats);
};

export const supabase_updateUnlimitedStats = async (
  unlimitedStats: UnlimitedStats,
) => {
  const supabase = await createClient();

  return await supabase
    .from('UnlimitedStats')
    .update(unlimitedStats)
    .eq('id', unlimitedStats.id);
};

export const supabase_saveCostars = async (
  costars: NewDailyCostars,
): Promise<void> => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from('DailyCostars')
      .insert({
        ...costars,
        solutions: undefined,
      })
      .select();

    const id = data![0].id;

    const solData = costars.solutions.map((sol) => ({
      daily_id: id,
      solution: sol.map((entity) => ({ ...entity, popularity: undefined })),
      is_daily_optimal: true,
    }));

    await supabase.from('Solutions').insert(solData);
  } catch {
    console.log(`Couldn't save costars for date ${costars.date}`);
  }
};

export const supabase_updateCostars = async (
  id: number,
  costars: NewDailyCostars,
): Promise<void> => {
  const supabase = await createClient();

  await supabase
    .from('Solutions')
    .delete()
    .eq('daily_id', id)
    .eq('is_daily_optimal', true);

  await supabase
    .from('DailyCostars')
    .update({
      starter: costars.starter,
      target: costars.target,
      num_solutions: costars.num_solutions,
    })
    .eq('id', id);

  const solData = costars.solutions.map((sol) => ({
    daily_id: id,
    solution: sol.map((entity) => ({ ...entity, popularity: undefined })),
    is_daily_optimal: true,
  }));

  await supabase.from('Solutions').insert(solData);
};

export const supabase_getDailyCostarsByDate = unstable_cache(
  async (date: Date): Promise<DailyCostars> => {
    console.log('COSTARS');
    const supabase = await createClientForCache();

    const { data } = await supabase
      .from('DailyCostars')
      .select()
      .eq('date', date.toLocaleString());

    if (!data || data.length === 0) throw Error('Invalid date');

    return data[0];
  },
  [],
  { tags: ['daily_costars'] },
);

export const supabase_getDailyCostarsByMonth = unstable_cache(
  async (month: number, year: number): Promise<Array<DailyCostars>> => {
    const supabase = await createClientForCache();

    const date = new Date(`${year}/${month}/01`);

    const start = new Date(date);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('DailyCostars')
      .select()
      .gte('date', start.toISOString())
      .lt('date', end.toISOString());

    if (!data) throw Error('Invalid date');

    return data;
  },
  [],
  { tags: ['daily_costars'] },
);

export const supabase_getDailyCostarsByDayNumber = unstable_cache(
  async (day_number: number): Promise<DailyCostars> => {
    const supabase = await createClientForCache();

    const { data } = await supabase
      .from('DailyCostars')
      .select()
      .eq('day_number', day_number);

    if (!data || data.length === 0) throw Error('Invalid date');

    return data[0];
  },
  [],
  { tags: ['daily_costars'] },
);

export const supabase_getAllFutureCostars = async (): Promise<
  Array<DailyCostars>
> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('DailyCostars')
    .select()
    .gt('date', new Date().toLocaleString())
    .order('date', { ascending: true });

  return data!;
};
