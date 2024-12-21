'use server';

import { createClient, createClientForCache } from "@/utils/supabase";
import { redirect } from "next/navigation";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url + 'api/authCallback'
}

export const login = async (type: 'google' | 'facebook') => {
	const supabase = await createClient();

	const { data } = await supabase.auth.signInWithOAuth({
		provider: type,
		options: {
			redirectTo: getURL(),
		},
	})
	
	if (data.url) {
		redirect(data.url) // use the redirect API for your server framework
	}
}

export const signOut = async () => {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut({ scope: 'local' });
	
	return error;
}

export const saveSolution = async (history: Array<GameEntity>, hints: Array<Hint>, is_temporary: boolean = false): Promise<string> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from('Solutions')
		.insert({ 
			solution: history.map(entity => ({...entity, credits: undefined})),
			hints: hints,
			is_temporary: is_temporary
		})
		.select();

	return data![0].id;
}

export const getSolution = async (uuid: string): Promise<Tables<"Solutions">> => {
	const supabase = await createClient();

  const { data } = await supabase
		.from("Solutions")
		.select()
		.eq('id', uuid);
	
	if(!data || data.length === 0)
		throw Error("Invalid uuid");

	return data[0];
}

export const deleteOldSolutions = async (): Promise<void> => {
	const supabase = await createClient();

	const date = new Date();
	date.setDate(date.getDate() - 7);

	await supabase
		.from('Solutions')
		.delete()
		.eq('is_temporary', true)
		.lt('created_at', date.toUTCString());
}

export const saveCostars = async (costars: Array<DailyCostars>): Promise<void> => {
	const supabase = await createClient();

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
	const supabase = await createClient();

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
	const supabase = await createClientForCache();


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
		day_number: data[0].day_number,
		starter: data[0].starter,
		target: data[0].target,
		solutions: {
			count: data[0].num_solutions,
			mostPopular: data2.map(solution => solution.solution)
		}
	};
}

export const getAllFutureCostars = async (): Promise<Array<DailyCostars>> => {
	const supabase = await createClient();

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