'use server';

import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

async function createSupabaseClient() {
	const client = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)

	return client;
}

let supabase: SupabaseClient<Database>;

export const saveSolution = async (history: Array<GameEntity>, hints: Array<Hint>): Promise<string> => {
	if(!supabase)
		supabase = await createSupabaseClient();

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
		supabase = await createSupabaseClient();

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
		supabase = await createSupabaseClient();

	const data = costars.map((val, ind) => {
		if(!val.date){
			const date = new Date();
			date.setDate(date.getDate() + ind + 7);
			date.setHours(0, 0, 0, 0);

			val.date = date.toISOString();
		}
		else{
			const date = new Date(val.date);
			date.setHours(0, 0, 0, 0);

			val.date = date.toISOString();
		}		
		
		return {
			starter: val.starter,
			target: val.target,
			date: val.date,
			num_solutions: val.solutions.count,
			solutions: val.solutions.mostPopular,
			day_number: Math.floor((new Date(val.date).getTime() - new Date("12/31/2024").getTime()) / (1000*60*60*24))
		}
	});

	for (const entry of data) {
		try{
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
		} catch {
			continue;
		}
	}
}

export const updateCostars = async (id: number, costars: DailyCostars): Promise<void> => {
	if(!supabase)
		supabase = await createSupabaseClient();

	await supabase
		.from('Solutions')
		.delete()
		.eq('daily_id', id)
		.eq('is_daily_optimal', true);

	await supabase
		.from('DailyCostars')
		.update({ starter: costars.starter, target: costars.target, num_solutions: costars.solutions.count })
		.eq('id', id);

	const solData = costars.solutions.mostPopular.map(sol => ({
		daily_id: id,
		solution: sol.map(entity => ({...entity, popularity: undefined})),
		is_daily_optimal: true
	}))

	await supabase
	.from('Solutions')
	.insert(solData);
}

export const getDailyCostars = async (): Promise<DailyCostars> => {
	if(!supabase)
		supabase = await createSupabaseClient();

	console.log("IN DAILY COSTARE")

	const { data } = await supabase
		.from('DailyCostars')
		.select()
		.eq('date', new Date().toLocaleString());


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

export const getAllFutureCostars = async (): Promise<Array<DailyCostars>> => {
	if(!supabase)
		supabase = await createSupabaseClient();

	const { data } = await supabase
		.from('DailyCostars')
		.select()
		.gt('date', new Date().toLocaleString())
		.order('date', { ascending: true });

	return data!.map(costars => ({
		...costars,
		solutions: {
			count: costars.num_solutions,
			mostPopular: []
		}
	}));
}