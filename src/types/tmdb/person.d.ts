interface Person {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string;
  known_for?: Array<Movie>;
  original_name?: string;
}

interface PersonCredit extends Person {
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface PersonDetails extends Person {
  also_known_as: Array<string>;
  biography: string;
  birthday: string;
  deathday: string | null;
  homepage: string | null;
  imdb_id: string;
  place_of_birth: string;
}
