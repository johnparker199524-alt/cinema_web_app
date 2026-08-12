import { getAllFilmRecords } from "./filmsApi";
import type { FilmCalendario, FilmSummary, PeriodoUscita } from "../types/cinema.types";
import {
  addDays,
  addMonths,
  isBetweenInclusive,
  mondayOfWeek,
  toISODate,
  today,
} from "../utils/dateUtils";

function toSummary(f: { id: number; titolo: string; immagineUrl: string; genere: string }): FilmSummary {
  return { id: f.id, titolo: f.titolo, immagineUrl: f.immagineUrl, genere: f.genere };
}

function toCalendario(f: {
  id: number;
  titolo: string;
  immagineUrl: string;
  genere: string;
  anno: number;
  dataUscita: string;
  regista: string;
  distributore: string | null;
}): FilmCalendario {
  return {
    id: f.id,
    titolo: f.titolo,
    immagineUrl: f.immagineUrl,
    genere: f.genere,
    anno: f.anno,
    dataUscita: f.dataUscita,
    regista: f.regista,
    distributore: f.distributore ?? "",
  };
}

// BLOCCO 1 — GET /api/calendario/in-programmazione
// Finestra [oggi - 1 mese ; oggi], stessa logica di CalendarioServiceImpl.
export async function getFilmInProgrammazioneOggi(): Promise<FilmSummary[]> {
  const films = await getAllFilmRecords();
  const oggi = today();
  const inizio = toISODate(addMonths(oggi, -1));
  const fine = toISODate(oggi);
  return films
    .filter((f) => isBetweenInclusive(f.dataUscita, inizio, fine))
    .sort((a, b) => a.dataUscita.localeCompare(b.dataUscita))
    .map(toSummary);
}

// BLOCCO 2 — GET /api/calendario/prossimamente
// Finestra [domani ; oggi + 3 mesi].
export async function getProssimeUscite(): Promise<FilmSummary[]> {
  const films = await getAllFilmRecords();
  const oggi = today();
  const inizio = toISODate(addDays(oggi, 1));
  const fine = toISODate(addMonths(oggi, 3));
  return films
    .filter((f) => isBetweenInclusive(f.dataUscita, inizio, fine))
    .sort((a, b) => a.dataUscita.localeCompare(b.dataUscita))
    .map(toSummary);
}

// BLOCCO 3 — GET /api/calendario/data?data=YYYY-MM-DD
// Finestra [data - 1 mese ; data], stessa "regola dei 30 giorni" del Blocco 1
// ma centrata sulla data scelta dall'utente invece che su "oggi".
export async function getFilmByData(dataISO: string): Promise<FilmSummary[]> {
  const films = await getAllFilmRecords();
  const data = new Date(dataISO);
  const inizio = toISODate(addMonths(data, -1));
  const fine = dataISO;
  return films
    .filter((f) => isBetweenInclusive(f.dataUscita, inizio, fine))
    .sort((a, b) => a.dataUscita.localeCompare(b.dataUscita))
    .map(toSummary);
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
  const films = await getAllFilmRecords();
  const oggi = today();
  const lunediSettimanaCorrente = mondayOfWeek(oggi);
  const scostamento = SCOSTAMENTO_SETTIMANE[periodo];
  const lunedi = addDays(lunediSettimanaCorrente, scostamento * 7);
  const domenica = addDays(lunedi, 6);
  const inizio = toISODate(lunedi);
  const fine = toISODate(domenica);
  return films
    .filter((f) => isBetweenInclusive(f.dataUscita, inizio, fine))
    .sort((a, b) => a.dataUscita.localeCompare(b.dataUscita))
    .map(toCalendario);
}
