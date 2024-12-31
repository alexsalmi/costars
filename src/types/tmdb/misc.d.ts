type TmdbType = 'person' | 'movie';

interface SpokenLanguage {
  english_name: string;
  iso_3166_1: string;
  name: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Genre {
  id: number;
  name: string;
}
