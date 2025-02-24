'use server';

const BASE_URL = 'https://api.themoviedb.org';
const headers = {
  Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
};

export const search = async (
  query: string,
  type: TmdbType = 'person',
): Promise<Array<GameEntity>> => {
  if (query.length === 0) return [];

  const url = `${BASE_URL}/3/search/${type}?query=${encodeURIComponent(query)}`;

  const response: TmdbSearchResult<Movie | Person> = await fetch(url, {
    headers,
    cache: 'force-cache',
  }).then((res) => res.json());

  const filtered = filterResults(response.results);

  const labels = new Set();
  const duplicates = new Set();

  for (const entity of filtered) {
    const label = (<Person>entity).name || (<Movie>entity).title;

    if (labels.has(label)) duplicates.add(label);

    labels.add(label);
  }

  return filtered
    .sort((a, b) => b.popularity - a.popularity)
    .map((a) => {
      const label = (<Person>a).name || (<Movie>a).title;
      return {
        type,
        id: a.id,
        label:
          duplicates.has(label) && (<Movie>a).release_date
            ? `${label} (${new Date((<Movie>a).release_date).getFullYear()})`
            : label,
        image: (<Person>a).profile_path || (<Movie>a).poster_path,
      };
    });
};

export const getDetails = async (
  id: number,
  type: TmdbType,
): Promise<PersonDetails | MovieDetails> => {
  const url = `${BASE_URL}/3/${type}/${id}`;

  const response: PersonDetails | MovieDetails = await fetch(url, {
    headers,
    next: {
      revalidate: 60 * 60 * 24 * 30,
    },
  }).then((res) => res.json());

  return response;
};

export const getCredits = async (
  id: number,
  type: TmdbType,
): Promise<Array<PersonCredit | MovieCredit>> => {
  const suffix = type === 'person' ? 'movie_credits' : 'credits';
  const url = `${BASE_URL}/3/${type}/${id}/${suffix}`;

  const response: TmdbCreditsResult<PersonCredit | MovieCredit> = await fetch(
    url,
    {
      headers,
      next: {
        revalidate: 60 * 60 * 24 * 30,
      },
    },
  ).then((res) => res.json());

  return filterResults(response.cast) as Array<PersonCredit | MovieCredit>;
};

export const getTrending = async (page: number): Promise<Array<Person>> => {
  const url = `${BASE_URL}/3/trending/person/week?page=${page}`;

  const response: TmdbSearchResult<Person> = await fetch(url, {
    headers,
    next: {
      tags: ['trending_people'],
    },
  }).then((res) => res.json());

  return response.results;
};

const filterResults = (
  results: Array<Movie | Person> | Array<PersonCredit | MovieCredit>,
): Array<Movie | Person> | Array<PersonCredit | MovieCredit> => {
  const BANNED_MOVIES = new Set([126314]);
  const BANNED_GENRES = new Set([99]);

  return results.filter(
    (a) =>
      a.popularity > 1 &&
      !(<Movie | MovieCredit>a).genre_ids?.some((g) => BANNED_GENRES.has(g)) &&
      !(
        (<Movie | MovieCredit>a).release_date !== undefined &&
        new Date((<Movie | MovieCredit>a).release_date) > new Date()
      ) &&
      !BANNED_MOVIES.has((<Movie | MovieCredit>a).id) &&
      !(
        (<Person | PersonCredit>a).known_for_department !== undefined &&
        (<Person | PersonCredit>a).known_for_department !== 'Acting'
      ),
  ) as Array<Movie | Person> | Array<PersonCredit | MovieCredit>;
};
