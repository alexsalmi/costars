'use server'

const BASE_URL = 'https://api.themoviedb.org';
const headers = {
	'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
}

export const search = async (query: string, type: TmdbType = 'person')
		: Promise<Array<GameEntity>> => {
	if (query.length === 0)
		return [];

	const url = `${BASE_URL}/3/search/${type}?query=${encodeURIComponent(query)}`;

	const response: TmdbSearchResult<Movie | Person> = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	const filtered = response.results
		.filter((a) => a.popularity > 5)
	
	const labels = new Set();
	const duplicates = new Set();

	for(const entity of filtered){
		const label = (<Person> entity).name || (<Movie> entity).title;

		if(labels.has(label))
			duplicates.add(label);

		labels.add(label);
	}

	return filtered
		.sort((a, b) => b.popularity - a.popularity)
		.map(a => {
			const label = (<Person> a).name || (<Movie> a).title;
			return {
				type,
				id: a.id,
				label: duplicates.has(label) && (<Movie> a).release_date ? 
					`${label} (${new Date((<Movie> a).release_date).getFullYear()})` :
					label, 
				image: (<Person> a).profile_path || (<Movie> a).poster_path
			}
		});
}

export const isMatch = async (guess: GameEntity, current?: GameEntity) => {
	if(!current)
		return true;

	const suffix = guess.type === 'person' ? 'movie_credits' : 'credits';
	const url = `${BASE_URL}/3/${guess.type}/${guess.id}/${suffix}`;

	const response: TmdbCreditsResult<PersonCredit | MovieCredit> = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	return response
		.cast?.find((a) => a.id === current.id) !== undefined;
}