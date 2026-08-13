import type { FilmDetail, FilmSummary, Genere } from "../types/cinema.types";
import { tmdbGet } from "./config";
import { GENERE_TO_TMDB_ID } from "./genereMap";
import { toFilmDetail, toFilmSummary } from "./mappers";
import type { TmdbMovieDetail, TmdbMovieListItem, TmdbPagedResponse } from "./tmdb.types";
const genereCache = new Map<Genere, Promise<FilmSummary[]>>();
const detailCache = new Map<number, Promise<FilmDetail>>();
export async function getFilmsByGenere(genere: Genere): Promise<FilmSummary[]> {
  if (!genereCache.has(genere)) {
    const promise = tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/discover/movie", {
      with_genres: GENERE_TO_TMDB_ID[genere],
      sort_by: "popularity.desc",
      include_adult: "false",
    }).then((res) => res.results.map(toFilmSummary));
    genereCache.set(genere, promise);
    promise.catch(() => genereCache.delete(genere));
  }
  return genereCache.get(genere)!;
}
export async function getFilmInEvidenza(): Promise<FilmSummary[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/trending/movie/week");
  return res.results.slice(0, 10).map(toFilmSummary);
}
export async function getAllFilms(): Promise<FilmSummary[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/movie/popular");
  return res.results.map(toFilmSummary);
}
export async function searchFilms(query: string): Promise<FilmSummary[]> {
  const q = query.trim();
  if (!q) return [];
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/search/movie", {
    query: q,
    include_adult: "false",
  });
  return res.results.map(toFilmSummary);
}
export async function getFilmById(id: number): Promise<FilmDetail> {
  if (!detailCache.has(id)) {
    const promise = tmdbGet<TmdbMovieDetail>(`/movie/${id}`, {
      append_to_response: "credits,videos",
    })
      .then(toFilmDetail)
      .catch((err) => {
        detailCache.delete(id);
        throw err instanceof Error
          ? new Error(`Film con id ${id} non trovato: ${err.message}`)
          : err;
      });
    detailCache.set(id, promise);
  }
  return detailCache.get(id)!;
}
