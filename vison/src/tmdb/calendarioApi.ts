import type { FilmCalendario, FilmSummary, PeriodoUscita } from "../types/cinema.types";
import { addDays, addMonths, mondayOfWeek, toISODate, today } from "../utils/dateUtils";
import { DEFAULT_REGION, tmdbGet } from "./config";
import { toFilmCalendario, toFilmSummary } from "./mappers";
import type { TmdbMovieDetail, TmdbMovieListItem, TmdbPagedResponse } from "./tmdb.types";

// discover/movie filtrato per finestra di date di uscita (primary_release_date),
// ordinato cronologicamente: e' l'equivalente TMDB del filtro in memoria su
// dataUscita che prima girava sull'intero dataset Firebase. "region: IT"
// privilegia le date di uscita italiane quando disponibili.
async function discoverByDateRange(inizio: string, fine: string): Promise<TmdbMovieListItem[]> {
  const res = await tmdbGet<TmdbPagedResponse<TmdbMovieListItem>>("/discover/movie", {
    "primary_release_date.gte": inizio,
    "primary_release_date.lte": fine,
    sort_by: "primary_release_date.asc",
    region: DEFAULT_REGION,
    include_adult: "false",
  });
  return res.results;
}

// Arricchisce ogni film della lista con regista/distributore, che TMDB
// espone solo sull'endpoint di dettaglio, non su discover. Le chiamate
// partono in parallelo: le finestre di date usate qui restituiscono
// tipicamente poche decine di titoli al massimo (una pagina), quindi il
// costo resta contenuto.
async function toCalendarioConDettagli(films: TmdbMovieListItem[]): Promise<FilmCalendario[]> {
  const dettagli = await Promise.all(
    films.map((f) =>
      tmdbGet<TmdbMovieDetail>(`/movie/${f.id}`, { append_to_response: "credits" }),
    ),
  );
  return dettagli.map(toFilmCalendario);
}

// BLOCCO 1 — GET /api/calendario/in-programmazione
// Finestra [oggi - 1 mese ; oggi], stessa logica di CalendarioServiceImpl.
export async function getFilmInProgrammazioneOggi(): Promise<FilmSummary[]> {
  const oggi = today();
  const inizio = toISODate(addMonths(oggi, -1));
  const fine = toISODate(oggi);
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}

// BLOCCO 2 — GET /api/calendario/prossimamente
// Finestra [domani ; oggi + 3 mesi].
export async function getProssimeUscite(): Promise<FilmSummary[]> {
  const oggi = today();
  const inizio = toISODate(addDays(oggi, 1));
  const fine = toISODate(addMonths(oggi, 3));
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}

// BLOCCO 3 — GET /api/calendario/data?data=YYYY-MM-DD
// Finestra [data - 1 mese ; data], stessa "regola dei 30 giorni" del Blocco 1
// ma centrata sulla data scelta dall'utente invece che su "oggi".
export async function getFilmByData(dataISO: string): Promise<FilmSummary[]> {
  const data = new Date(dataISO);
  const inizio = toISODate(addMonths(data, -1));
  const fine = dataISO;
  const films = await discoverByDateRange(inizio, fine);
  return films.map(toFilmSummary);
}

// BLOCCO 4 — GET /api/calendario/periodo?periodo=...
// Bucket settimanale lunedi'-domenica, stesso calcolo di
// CalendarioServiceImpl.getFilmByPeriodo (WeekFields Monday-start).
const SCOSTAMENTO_SETTIMANE: Record<PeriodoUscita, number> = {
  SCORSA_SETTIMANA: -1,
  QUESTA_SETTIMANA: 0,
  TRA_1_SETTIMANA: 1,
  TRA_2_SETTIMANE: 2,
  TRA_3_SETTIMANE: 3,
};

export async function getFilmByPeriodo(periodo: PeriodoUscita): Promise<FilmCalendario[]> {
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
