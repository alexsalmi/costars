interface TmdbSearchResult<T> {
	page: string,
	results: Array<T>
}

interface TmdbCreditsResult<T> {
	id: number,
	cast: Array<T>,
	crew: Array<T>
}