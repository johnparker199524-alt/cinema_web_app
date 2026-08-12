import { get, ref } from "firebase/database";
import { db } from "./config";
import type { FilmDetail, FilmSummary, Genere } from "../types/cinema.types";

// Forma "grezza" di un nodo /films/{id} nel Realtime Database: stessi campi
// dell'entita' JPA Film (camelCase), ma con distributore opzionale/nullable
// (nel data.sql originale la colonna non veniva mai popolata).
interface FilmRecord extends FilmDetail {
  inEvidenza: boolean;
}

// ---------------------------------------------------------------------
// CACHE IN MEMORIA
// ---------------------------------------------------------------------
// Il Realtime Database non supporta query "ricche" lato server come
// findByGenere/findByTitoloContaining di Spring Data JPA: qui si legge
// UNA SOLA VOLTA l'intero nodo /films (170 elementi, dataset piccolo,
// adatto a stare in memoria) e si filtra in JavaScript, esattamente
// replicando la logica che prima viveva in FilmServiceImpl. La Promise
// viene cachata cosi' le 10 chiamate fetchFilmsByGenere() lanciate dalla
// Home (una per genere) leggono il DB una sola volta, non dieci.
let filmsCache: Promise<FilmRecord[]> | null = null;

function loadAllFilmRecords(): Promise<FilmRecord[]> {
  if (!filmsCache) {
    filmsCache = get(ref(db, "films"))
      .then((snapshot) => {
        if (!snapshot.exists()) return [];
        const value = snapshot.val() as Record<string, FilmRecord>;
        // Object.values perche' in RTDB le chiavi sono stringhe ("1", "2"...);
        // l'ordinamento per id ricalca l'ordine "naturale" che prima dava
        // JpaRepository.findAll() (chiave primaria crescente).
        return Object.values(value).sort((a, b) => a.id - b.id);
      })
      .catch((err) => {
        filmsCache = null; // non cachare un fallimento: il prossimo tentativo riprova il fetch
        throw err;
      });
  }
  return filmsCache;
}

function toSummary(f: FilmRecord): FilmSummary {
  return {
    id: f.id,
    titolo: f.titolo,
    immagineUrl: f.immagineUrl,
    genere: f.genere,
  };
}

function toDetail(f: FilmRecord): FilmDetail {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { inEvidenza, ...detail } = f;
  return detail;
}

// GET /api/films
export async function getAllFilms(): Promise<FilmSummary[]> {
  const films = await loadAllFilmRecords();
  return films.map(toSummary);
}

// GET /api/films/evidenza -> findByInEvidenzaTrue()
export async function getFilmInEvidenza(): Promise<FilmSummary[]> {
  const films = await loadAllFilmRecords();
  return films.filter((f) => f.inEvidenza).map(toSummary);
}

// GET /api/films/genere/{genere} -> findByGenere(genere)
export async function getFilmsByGenere(genere: Genere): Promise<FilmSummary[]> {
  const films = await loadAllFilmRecords();
  return films.filter((f) => f.genere === genere).map(toSummary);
}

// GET /api/films/cerca?query=... -> findByTitoloContainingIgnoreCaseOrRegistaContainingIgnoreCase
export async function searchFilms(query: string): Promise<FilmSummary[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const films = await loadAllFilmRecords();
  return films
    .filter(
      (f) =>
        f.titolo.toLowerCase().includes(q) ||
        (f.regista ?? "").toLowerCase().includes(q),
    )
    .map(toSummary);
}

// GET /api/films/{id} -> findById(id).orElseThrow(ResourceNotFoundException)
export async function getFilmById(id: number): Promise<FilmDetail> {
  const films = await loadAllFilmRecords();
  const film = films.find((f) => f.id === id);
  if (!film) {
    throw new Error(`Film con id ${id} non trovato`);
  }
  return toDetail(film);
}

// Usata solo da calendarioApi.ts per riusare la stessa cache/lista completa
// (equivalente del FilmRepository iniettato in CalendarioServiceImpl).
export async function getAllFilmRecords(): Promise<FilmRecord[]> {
  return loadAllFilmRecords();
}
