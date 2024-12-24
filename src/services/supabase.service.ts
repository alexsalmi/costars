'use server';
import { createClient, createClientForCache } from "@/utils/supabase";

export const supabase_getSolution = async (uuid: string): Promise<Solution> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Solutions")
		.select()
		.eq('id', uuid);
	
	if(!data || data.length === 0)
		throw Error("Invalid uuid");

	return data[0];
}

export const supabase_saveSolution = async (solutions: Solution | Array<Solution>): Promise<string> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from('Solutions')
		.insert(solutions)
		.select();
	
	if (!data || data.length === 0)
		return '';

	return data[0].id;
}

export const supabase_getUserDailySolutions = async (user_id: string): Promise<Array<Solution>> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Solutions")
		.select()
		.eq('user_id', user_id)
		.not('daily_id', 'is', null);
	
	if (!data)
		return [];

	return data;
}

export const supabase_getDailySolutions = async (daily_id: number): Promise<Array<Solution>> => {
	const supabase = await createClientForCache();

	const { data } = await supabase
		.from("Solutions")
		.select()
		.eq('daily_id', daily_id)
		.eq('is_daily_optimal', true);
	
	if(!data || data.length === 0)
		throw Error("Invalid daily_id");

	return data;
}

export const supabase_deleteOldSolutions = async (): Promise<void> => {
	const supabase = await createClient();

	const date = new Date();
	date.setDate(date.getDate() - 7);

	await supabase
		.from('Solutions')
		.delete()
		.eq('is_temporary', true)
		.lt('created_at', date.toUTCString());
}

export const supabase_getDailyStats = async (user_id: string): Promise<DailyStats> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from("DailyStats")
		.select()
		.eq('user_id', user_id);
	
	if (!data || data.length === 0) {
		const { data } = await supabase
			.from("DailyStats")
			.insert({
				user_id,
				days_played: 0,
				current_streak: 0,
				highest_streak: 0,
				optimal_solutions: 0
			})
			.select();
		
		return data![0];
	}

	return data[0];
}

export const supabase_hasDailyStats = async (user_id: string): Promise<boolean> => {
	const supabase = await createClient();

	console.log("Checking for daily costars")
	const { data } = await supabase
		.from("DailyStats")
		.select()
		.eq('user_id', user_id);
	
	console.log(JSON.stringify(data));

	return (data && data.length > 0) || false;
}

export const supabase_updateDailyStats = async (dailyStats: DailyStats) => {
	const supabase = await createClient();
	
	await supabase
		.from("DailyStats")
		.update(dailyStats)
		.eq('id', dailyStats.id);
}

export const supabase_getUnlimitedStats = async (user_id: string): Promise<UnlimitedStats> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from("UnlimitedStats")
		.select()
		.eq('user_id', user_id);
	
	if (!data || data.length === 0) {
		const { data } = await supabase
			.from("UnlimitedStats")
			.insert({
				user_id,
				history: [],
				hints: [],
				high_score: 0
			})
			.select();
		
		return data![0];
	}

	return data[0];
}

export const supabase_updateUnlimitedStats = async (unlimitedStats: UnlimitedStats) => {
	const supabase = await createClient();
	
	await supabase
		.from("UnlimitedStats")
		.update(unlimitedStats)
		.eq('id', unlimitedStats.id);
}

export const supabase_saveCostars = async (costars: NewDailyCostars): Promise<void> => {
	const supabase = await createClient();

	try{
		const { data } = await supabase
			.from('DailyCostars')
			.insert({
				...costars,
				solutions: undefined
			})
			.select();
		
		const id = data![0].id;

		const solData = costars.solutions.map(sol => ({
			daily_id: id,
			solution: sol.map(entity => ({...entity, popularity: undefined})),
			is_daily_optimal: true
		}))
		
		await supabase
			.from('Solutions')
			.insert(solData);
	} catch {
		console.log(`Couldn't save costars for date ${costars.date}`);
	}
}

export const supabase_updateCostars = async (id: number, costars: NewDailyCostars): Promise<void> => {
	const supabase = await createClient();

	await supabase
		.from('Solutions')
		.delete()
		.eq('daily_id', id)
		.eq('is_daily_optimal', true);

	await supabase
		.from('DailyCostars')
		.update({ starter: costars.starter, target: costars.target, num_solutions: costars.num_solutions })
		.eq('id', id);

	const solData = costars.solutions.map(sol => ({
		daily_id: id,
		solution: sol.map(entity => ({...entity, popularity: undefined})),
		is_daily_optimal: true
	}))

	await supabase
	.from('Solutions')
	.insert(solData);
}

export const supabase_getDailyCostars = async (date: Date): Promise<DailyCostars> => {
	const supabase = await createClientForCache();

	const { data } = await supabase
		.from('DailyCostars')
		.select()
		.eq('date', date.toLocaleString());

	if(!data || data.length === 0)
		throw Error("Invalid date");

	return data[0];
}

export const supabase_getAllFutureCostars = async (): Promise<Array<DailyCostars>> => {
	const supabase = await createClient();

	const { data } = await supabase
		.from('DailyCostars')
		.select()
		.gt('date', new Date().toLocaleString())
		.order('date', { ascending: true });

	return data!;
}
