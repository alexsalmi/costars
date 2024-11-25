/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

const BASE_URL = 'https://api.themoviedb.org';
const headers = {
	'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
}

export const search = async (query: string, type: SearchType = 'person') => {
	if (query.length < 3)
		return [];
	const url = `${BASE_URL}/3/search/${type}?query=${encodeURIComponent(query)}`;

	const response = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	return response.results.filter((a: { popularity: number; }) => a.popularity > 5).map((a: {
		title: string;
		profile_path: any;
		poster_path: any; name: string; id: number; 
}) => ({label: a.name || a.title, id: a.id, type, image: a.profile_path?.replace(".png", ".svg") || a.poster_path?.replace(".png", ".svg")}));
}

export const submit = async (guess: GameEntity, current?: GameEntity) => {
	if (!guess)
		return;
	if(!current)
		return true;

	let personid: number;
	let content: GameEntity;

	if(guess.type === 'person'){
		personid = guess.id;
		content = current;
	} else {
		personid = current.id;
		content = guess;
	}

	const url = `${BASE_URL}/3/${content.type}/${content.id}/credits`;

	const res = await fetch(url, {
		headers,
		cache: 'force-cache'
	})

	const data = await res.json();

	return data.cast.find((person: any) => person.id === personid) !== undefined;
}