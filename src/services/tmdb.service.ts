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

export const getPerson = async (id: number): Promise<PersonDetails> => {
	const url = `${BASE_URL}/3/person/${id}`;

	const response: PersonDetails = await fetch(url, {
		headers,
		next: {
			revalidate: 60 * 60 * 24 * 30
		}
	}).then(res => res.json());

	return response;
}

export const getCredits = async (id: number, type: TmdbType)
		: Promise<TmdbCreditsResult<PersonCredit | MovieCredit>> => {
	const suffix = type === 'person' ? 'movie_credits' : 'credits';
	const url = `${BASE_URL}/3/${type}/${id}/${suffix}`;

	const response: TmdbCreditsResult<PersonCredit | MovieCredit> = await fetch(url, {
		headers,
		next: {
			revalidate: 60 * 60 * 24 * 30
		}
	}).then(res => res.json());

	return response;
}

export const getTrending = async (page: number): Promise<Array<Person>> => {
	const url = `${BASE_URL}/3/trending/person/week?page=${page}`;
	
	const response: TmdbSearchResult<Person> = await fetch(url, {
		headers,
		next: {
			revalidate: 60 * 60 * 24 * 7
		}
	}).then(res => res.json());

	return response.results;
}
