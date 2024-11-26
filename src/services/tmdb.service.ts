'use server'

const BASE_URL = 'https://api.themoviedb.org';
const headers = {
	'Authorization': `Bearer ${process.env.Tmdb_API_KEY}`
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

	return response.results
		.filter((a) => a.popularity > 5)
		.sort((a, b) => a.popularity - b.popularity)
		.map(a => ({
			type,
			id: a.id,
			label: (<Person> a).name || (<Movie> a).title, 
			image: (<Person> a).profile_path?.replace(".png", ".svg") || 
						 (<Movie> a).poster_path?.replace(".png", ".svg")
		}));
}

export const submit = async (guess: GameEntity, current?: GameEntity) => {
	if(!current)
		return true;

	const suffix = guess.type === 'person' ? 'movie_credits' : 'credits';
	const url = `${BASE_URL}/3/${guess.type}/${guess.id}/${suffix}`;

	const response: TmdbCreditsResult<PersonCredit | MovieCredit> = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	return response.cast
		.find((a) => a.id === current.id) !== undefined;
}