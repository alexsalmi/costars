interface Movie {
	id: number,
	title: string,
	original_title: string,
	adult: boolean,
	overview: string,
	release_date: string,
	poster_path: string,
	backdrop_path: string,
	popularity: number,
	genre_ids: Array<integer>,
	original_language: string,
	video: boolean,
	vote_average: number,
	vote_count: number,
}

interface MovieCredit extends Movie {
	character: string,
	order: number,
}

interface MovieDetails extends Movie {
	belongs_to_collection: boolean,
	budget: number,
	genres: Array<Genre>,
	homepage: string,
	imdb_id: string,
	origin_country: Array<string>,
	production_companies: Array<ProductionCompany>,
	production_countried: Array<ProductionCountry>,
	revenue: number,
	runtime: number,
	spoken_languages: Array<SpokenLanguage>,
	status: string,
	tagline: string
}
