import { createClient } from '@/utils/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export const sbGetUnlimitedStats = async (
  params: UnlimitedStatsParams,
): Promise<UnlimitedStats | null> => {
  const supabase = await createClient();

  const { user_id } = params;

  const { data } = await supabase
    .from('UnlimitedStats')
    .select()
    .eq('user_id', user_id);

  if (!data || data.length === 0) return null;

  return data[0];
};

export const sbPostUnlimitedStats = async (
  unlimitedStats: UnlimitedStats,
): Promise<UnlimitedStats> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from('UnlimitedStats')
    .insert(unlimitedStats)
    .select();

  return data![0];
};

export const sbUpdateUnlimitedStats = async (
  unlimitedStats: UnlimitedStats,
): Promise<PostgrestSingleResponse<Array<UnlimitedStats>>> => {
  const supabase = await createClient();

  return await supabase
    .from('UnlimitedStats')
    .update(unlimitedStats)
    .eq('id', unlimitedStats.id)
    .select('updated_at');
};
