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
		cache: 'force-cache'
	}).then(res => res.json());

	return response;
}

export const getCredits = async (entity: GameEntity)
		: Promise<TmdbCreditsResult<PersonCredit | MovieCredit>> => {
	const suffix = entity.type === 'person' ? 'movie_credits' : 'credits';
	const url = `${BASE_URL}/3/${entity.type}/${entity.id}/${suffix}`;

	const response: TmdbCreditsResult<PersonCredit | MovieCredit> = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	return response;
}

export const randomPerson = async (): Promise<GameEntity> => {
	const baseUrl = `${BASE_URL}/3/trending/person/day?language=en-US&page=`;
	const promises: Promise<TmdbSearchResult<Person>>[] = [];

	for(let i=1; i<=10; i++){
		const url = `${baseUrl}${i}`;

		const promise: Promise<TmdbSearchResult<Person>> = fetch(url, {
			headers,
			next: {
				revalidate: 86400
			}
		}).then(res => res.json());

		promises.push(promise);
	}

	const results: Array<Person> = [];

	const responses = await Promise.all(promises);

	for(const res of responses){
		results.push(...res.results
			.filter(val => val.known_for_department === "Acting" && val.popularity > 50)
		);
	}

	const randomPerson = results[Math.floor(Math.random() * results.length)];
	
	return {
		id: randomPerson.id,
		label: randomPerson.name,
		image: randomPerson.profile_path,
		type: 'person'
	}
}