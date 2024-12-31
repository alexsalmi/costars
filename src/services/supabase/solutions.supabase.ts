'use server';
import { createClient, createClientForCache } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const sbGetSolutions = async (
  params: SolutionParams,
  clientSide?: boolean,
): Promise<Array<Solution>> => {
  let supabase: SupabaseClient;

  if (clientSide) supabase = await createClientForCache();
  else supabase = await createClient();

  const { uuid, user_id, daily_id, all_daily } = params;

  let query = supabase.from('Solutions').select('*');
  if (uuid) query = query.eq('id', uuid);
  if (user_id) query = query.eq('user_id', user_id);
  if (daily_id) query = query.eq('daily_id', daily_id);
  if (all_daily) query = query.not('daily_id', 'is', null);

  const { data } = await query;

  if (!data) throw Error('Invalid query');

  return data;
};

export const sbSaveSolutions = async (
  solutions: Solution | Array<Solution>,
): Promise<string> => {
  const supabase = await createClient();

  const { data } = await supabase.from('Solutions').insert(solutions).select();

  if (!data || data.length === 0) return '';

  return data[0].id;
};

export const sbDeleteSolutions = async (
  params: SolutionParams,
): Promise<void> => {
  const supabase = await createClient();

  const { is_temporary, after_date } = params;

  await supabase
    .from('Solutions')
    .delete()
    .eq('is_temporary', is_temporary)
    .lt('created_at', after_date);
};
