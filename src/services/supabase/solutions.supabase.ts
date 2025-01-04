'use server';
import { createClient, createClientForCache } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const sbGetSolutions = async (
  params: SolutionParams,
  forCache?: boolean,
): Promise<Array<Solution>> => {
  let supabase: SupabaseClient;

  if (forCache) supabase = await createClientForCache();
  else supabase = await createClient();

  const { uuid, user_id, daily_id, all_daily, is_daily_optimal } = params;

  let query = supabase.from('Solutions').select();
  if (uuid) query = query.eq('id', uuid);
  if (user_id) query = query.eq('user_id', user_id);
  if (daily_id) query = query.eq('daily_id', daily_id);
  if (all_daily) query = query.not('daily_id', 'is', null);
  if (is_daily_optimal) query = query.eq('is_daily_optimal', is_daily_optimal);

  const { data } = await query;

  if (!data) throw Error('Invalid query');

  return data;
};

export const sbPostSolutions = async (
  solutions: Solution | Array<Solution>,
): Promise<string> => {
  const supabase = await createClient();

  if (!Array.isArray(solutions)) solutions = [solutions];

  // Remove credits array before saing to DB, takes up unnecessary space
  solutions = solutions.map((row) => ({
    ...row,
    solution: row.solution.map((sol) => ({
      ...sol,
      credits: undefined,
      popularity: undefined,
    })),
  }));

  const { data } = await supabase.from('Solutions').insert(solutions).select();

  if (!data || data.length === 0) return '';

  return data[0].id;
};

export const sbDeleteSolutions = async (
  params: SolutionParams,
): Promise<void> => {
  const supabase = await createClient();

  const { daily_id, is_daily_optimal, is_temporary, before_date } = params;

  let query = supabase.from('Solutions').delete();

  if (daily_id) query = query.eq('daily_id', daily_id);
  if (is_daily_optimal) query = query.eq('is_daily_optimal', is_daily_optimal);
  if (is_temporary) query = query.eq('is_temporary', is_temporary);
  if (before_date) query = query.lt('created_at', before_date);

  await query;
};
