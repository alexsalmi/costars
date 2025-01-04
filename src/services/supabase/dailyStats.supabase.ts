'use server';
import { createClient, createClientForCache } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUser } from './auth.service';

export const sbGetDailyStats = async (
  params: DailyStatsParams,
  forCache?: boolean,
): Promise<DailyStats | null> => {
  let supabase: SupabaseClient;

  if (forCache) supabase = await createClientForCache();
  else supabase = await createClient();

  let { user_id } = params;

  if (!user_id) user_id = (await getUser())?.id;

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
