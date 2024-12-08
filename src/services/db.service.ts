'use server';

import { Database } from '@/types/db';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'

async function createClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet: { name: any; value: any; options: any }[]) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	)
}

let supabase: SupabaseClient<Database, 'public', any> | undefined;

export const saveSolution = async (history: Array<GameEntity>): Promise<string> => {
	if(!supabase)
		supabase = await createClient();

	const { data } = await supabase
		.from('Solutions')
		.insert({ 
			solution: history.map(entity => ({...entity, credits: undefined}))
		})
		.select();

	return data![0].id;
}

export const getSolution = async (uuid: string): Promise<Array<GameEntity>> => {
	if(!supabase)
		supabase = await createClient();

  const { data } = await supabase
		.from("Solutions")
		.select('solution')
		.eq('id', uuid);
	
	if(!data || data.length === 0)
		throw Error("Invalid uuid");

	return data[0].solution;
}