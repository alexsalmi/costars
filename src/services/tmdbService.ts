'use server'

const BASE_URL = 'https://api.themoviedb.org';
const headers = {
	'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
}

export const  search = async (query: string, type: SearchType) => {
	const url = `${BASE_URL}/3/search/${type}?query=${encodeURIComponent(query)}`;
	console.log(url);

	const response = await fetch(url, {
		headers,
		cache: 'force-cache'
	}).then(res => res.json());

	console.log(JSON.stringify(response));
}