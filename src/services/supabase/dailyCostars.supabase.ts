'use server';
import { createClient, createClientForCache } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const sbGetDailyCostars = async (
  params: DailyCostarsParams,
  forCache?: boolean,
): Promise<Array<DailyCostars> | null> => {
  let supabase: SupabaseClient;

  if (forCache) supabase = await createClientForCache();
  else supabase = await createClient();

  const { id, date, day_number, after_date, before_date } = params;

  let query = supabase.from('DailyCostars').select();

  if (id) query = query.eq('id', id);
  if (date) query = query.eq('date', date);
  if (day_number) query = query.eq('day_number', day_number);
  if (after_date) query = query.gte('date', after_date);
  if (before_date) query = query.lt('date', before_date);

  const { data } = await query.order('date', { ascending: true });

  if (!data) throw Error('Invalid query');

  return data;
};

export const sbPostDailyCostars = async (
  costars: DailyCostars,
): Promise<number | null> => {
  const supabase = await createClient();

  const { data } = await supabase.from('DailyCostars').insert(costars).select();

  if (!data || data.length === 0) return null;

  return data[0].id;
};

export const sbUpdateDailyCostars = async (
  costars: DailyCostars,
): Promise<void> => {
  const supabase = await createClient();

  await supabase.from('DailyCostars').update(costars).eq('id', costars.id);
};
