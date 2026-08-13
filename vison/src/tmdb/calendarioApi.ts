import type { FilmCalendario, FilmSummary, PeriodoUscita } from "../types/cinema.types";
import { addDays, addMonths, mondayOfWeek, toISODate, today } from "../utils/dateUtils";
import { DEFAULT_REGION, tmdbGet } from "./config";
import { toFilmCalendario, toFilmSummary } from "./mappers";
import type { TmdbMovieDetail, TmdbMovieListItem, TmdbPagedResponse } from "./tmdb.types";
async function discoverByDateRange(
  inizio: string,
  fine: string,
): Promise<TmdbMovieListItem[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/discover/movie", {
    "primary_release_date.gte": inizio,
    "primary_release_date.lte": fine,
    sort_by: "primary_release_date.asc",
    region: DEFAULT_REGION,
    include_adult: "false",
  });
  return res.results;
}
async function toCalendarioConDettagli(
  films: TmdbMovieListItem[],
): Promise<FilmCalendario[]> {
  const dettagli = await Promise.all(
    films.map((f) =>
      tmdbGet<TmdbMovieDetail>(`/movie/${f.id}`, {
        append_to_response: "credits",
      }),
    ),
  );
  return dettagli.map(toFilmCalendario);
}
export async function getFilmInProgrammazioneOggi(): Promise<FilmSummary[]> {
  const oggi = today();
  const inizio = toISODate(addMonths(oggi, -1));
  const fine = toISODate(oggi);
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}
export async function getProssimeUscite(): Promise<FilmSummary[]> {
  const oggi = today();
  const inizio = toISODate(addDays(oggi, 1));
  const fine = toISODate(addMonths(oggi, 3));
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}
export async function getFilmByData(dataISO: string): Promise<FilmSummary[]> {
  const data = new Date(dataISO);
  const inizio = toISODate(addMonths(data, -1));
  const fine = dataISO;
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}
const SCOSTAMENTO_SETTIMANE: Record<PeriodoUscita, number> = {
  SCORSA_SETTIMANA: -1,
  QUESTA_SETTIMANA: 0,
  TRA_1_SETTIMANA: 1,
  TRA_2_SETTIMANE: 2,
  TRA_3_SETTIMANE: 3,
};
export async function getFilmByPeriodo(
  periodo: PeriodoUscita,
): Promise<FilmCalendario[]> {
  const oggi = today();
  const lunediSettimanaCorrente = mondayOfWeek(oggi);
  const scostamento = SCOSTAMENTO_SETTIMANE[periodo];
  const lunedi = addDays(lunediSettimanaCorrente, scostamento * 7);
  const domenica = addDays(lunedi, 6);
  const inizio = toISODate(lunedi);
  const fine = toISODate(domenica);
  const films = await discoverByDateRange(inizio, fine);
  return toCalendarioConDettagli(films);
}
