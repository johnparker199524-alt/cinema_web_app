// Sottoinsieme (solo i campi che usiamo) delle risposte reali di TMDB.
// Vedi https://developer.themoviedb.org/reference/movie-details per lo
// schema completo.

export interface TmdbMovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  release_date: string; // "YYYY-MM-DD", puo' essere stringa vuota se ignota
  overview: string;
}

export interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbCrewMember {
  job: string;
  name: string;
}

export interface TmdbProductionCompany {
  name: string;
}

// Un elemento di GET /movie/{id}/videos (qui incluso via
// append_to_response=videos): trailer, teaser, dietro le quinte...
// ospitati su YouTube o Vimeo.
export interface TmdbVideo {
  key: string; // id del video su YouTube/Vimeo, usato per l'embed
  site: "YouTube" | "Vimeo" | string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | string;
  official: boolean;
  name: string;
}

// Risposta di GET /movie/{id}?append_to_response=credits,videos
export interface TmdbMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  release_date: string;
  overview: string;
  production_companies: TmdbProductionCompany[];
  credits?: {
    crew: TmdbCrewMember[];
  };
  videos?: {
    results: TmdbVideo[];
  };
}
