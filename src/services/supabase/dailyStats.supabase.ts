'use server';
import { createClient } from '@/utils/supabase';

export const sbGetDailyStats = async (
  params: DailyStatsParams,
): Promise<DailyStats | null> => {
  const supabase = await createClient();

  const { user_id } = params;

  const { data } = await supabase
    .from('DailyStats')
    .select()
    .eq('user_id', user_id);

  if (!data || data.length === 0) return null;

  return data[0];
};

export const sbPostDailyStats = async (
  dailyStats: DailyStats,
): Promise<DailyStats> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('DailyStats')
    .insert(dailyStats)
    .select();

  return data![0];
};

export const sbUpdateDailyStats = async (dailyStats: DailyStats) => {
  const supabase = await createClient();

  return await supabase
    .from('DailyStats')
    .update(dailyStats)
    .eq('id', dailyStats.id);
};
