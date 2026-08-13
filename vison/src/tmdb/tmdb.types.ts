export interface TmdbMovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  release_date: string;
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
export interface TmdbVideo {
  key: string;
  site: "YouTube" | "Vimeo" | string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | string;
  official: boolean;
  name: string;
}
export interface TmdbMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  genres: {
    id: number;
    name: string;
  }[];
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
