'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'

async function createClient() {
	const cookieStore = await cookies()

	const client = createServerClient<Database>(
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

	return client;
}

let supabase: SupabaseClient<Database>;

export const saveSolution = async (history: Array<GameEntity>, hints: Array<Hint>): Promise<string> => {
	if(!supabase)
		supabase = await createClient();

	const { data } = await supabase
		.from('Solutions')
		.insert({ 
			solution: history.map(entity => ({...entity, credits: undefined})),
			hints: hints
		})
		.select();

	return data![0].id;
}

export const getSolution = async (uuid: string): Promise<Tables<"Solutions">> => {
	if(!supabase)
		supabase = await createClient();

  const { data } = await supabase
		.from("Solutions")
		.select()
		.eq('id', uuid);
	
	if(!data || data.length === 0)
		throw Error("Invalid uuid");

	return data[0];
}

export const saveCostars = async (costars: Array<DailyCostars>): Promise<void> => {
	if(!supabase)
		supabase = await createClient();

	const data = costars.map((val, ind) => {
		const date = new Date();
		date.setDate(date.getDate() + ind + 7);
		
		return {
			starter: val.starter,
			target: val.target,
			date: date.toISOString(),
			num_solutions: val.solutions.count,
			solutions: val.solutions.mostPopular,
			day_number: Math.floor((date.getTime() - new Date("01/01/2025").getTime()) / (1000*60*60*24))
		}
	});

	for (const entry of data) {
		const { data } = await supabase
			.from('DailyCostars')
			.insert({
				...entry,
				solutions: undefined
			})
			.select();
		
		const id = data![0].id;

		const solData = entry.solutions.map(sol => ({
			daily_id: id,
			solution: sol.map(entity => ({...entity, popularity: undefined})),
			is_daily_optimal: true
		}))
		
		await supabase
			.from('Solutions')
			.insert(solData);
	}
}

export const getDailyCostars = async (): Promise<DailyCostars> => {
	if(!supabase)
		supabase = await createClient();

	const { data } = await supabase
		.from('DailyCostars')
		.select()
		.eq('date', new Date().toISOString());


	if(!data || data.length === 0)
		throw Error("Invalid date");

	const { data: data2 } = await supabase
		.from('Solutions')
		.select()
		.eq('daily_id', data[0].id)
		.eq('is_daily_optimal', true);
	
	if(!data2 || data2.length === 0)
		throw Error("Invalid date");

	return {
		starter: data[0].starter,
		target: data[0].target,
		solutions: {
			count: data[0].num_solutions,
			mostPopular: data2.map(solution => solution.solution)
		}
	};
}

