import type { FilmDetail, FilmSummary, Genere } from "../types/cinema.types";
import { tmdbGet } from "./config";
import { GENERE_TO_TMDB_ID } from "./genereMap";
import { toFilmDetail, toFilmSummary } from "./mappers";
import type { TmdbMovieDetail, TmdbMovieListItem, TmdbPagedResponse } from "./tmdb.types";

// ---------------------------------------------------------------------
// CACHE IN MEMORIA
// ---------------------------------------------------------------------
// A differenza del Realtime Database (un solo nodo /films letto una
// volta), TMDB e' un catalogo enorme e paginato: non ha senso "scaricarlo
// tutto" in memoria. Cachiamo invece per-richiesta (una entry per genere,
// una per query di ricerca, una per id) cosi' che chiamate ripetute con
// gli stessi parametri (es. Home che ri-monta) non rifacciano la stessa
// richiesta di rete. Ogni funzione ha la propria piccola cache Map,
// analoga nello spirito a "filmsCache" della versione Firebase.
const genereCache = new Map<Genere, Promise<FilmSummary[]>>();
const detailCache = new Map<number, Promise<FilmDetail>>();

// GET /api/films/genere/{genere} -> discover/movie filtrato per genere,
// ordinato per popolarita' (equivalente "editoriale" del findByGenere
// lato JPA, che non aveva un ordinamento esplicito).
export async function getFilmsByGenere(genere: Genere): Promise<FilmSummary[]> {
  if (!genereCache.has(genere)) {
    const promise = tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/discover/movie", {
      with_genres: GENERE_TO_TMDB_ID[genere],
      sort_by: "popularity.desc",
      include_adult: "false",
    }).then((res) => res.results.map(toFilmSummary));
    genereCache.set(genere, promise);
    promise.catch(() => genereCache.delete(genere)); // non cachare i fallimenti
  }
  return genereCache.get(genere)!;
}

// GET /api/films/evidenza -> i film di tendenza della settimana, presi
// come "in evidenza" al posto del flag inEvidenza che esisteva solo nel
// dataset Firebase (TMDB non ha un concetto equivalente).
export async function getFilmInEvidenza(): Promise<FilmSummary[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/trending/movie/week");
  return res.results.slice(0, 10).map(toFilmSummary);
}

// GET /api/films -> popolari del momento (usata raramente nella UI
// attuale, mantenuta per parita' con l'API precedente).
export async function getAllFilms(): Promise<FilmSummary[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/movie/popular");
  return res.results.map(toFilmSummary);
}

// GET /api/films/cerca?query=... -> search/movie, l'endpoint di ricerca
// full-text nativo di TMDB (sostituisce il filtro titolo/regista in
// memoria: TMDB non permette di cercare per regista in un'unica query,
// solo per titolo/parole chiave del film).
export async function searchFilms(query: string): Promise<FilmSummary[]> {
  const q = query.trim();
  if (!q) return [];
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/search/movie", {
    query: q,
    include_adult: "false",
  });
  return res.results.map(toFilmSummary);
}

// GET /api/films/{id} -> dettaglio + credits (per regista) + videos (per il
// trailer) in una sola chiamata grazie ad append_to_response, cosi' come
// production_companies (per il campo "distributore") che e' gia' incluso
// nel dettaglio.
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
