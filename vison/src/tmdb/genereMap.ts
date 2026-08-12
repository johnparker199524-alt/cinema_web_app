import type { Genere } from "../types/cinema.types";

// Id ufficiali dei generi "movie" di TMDB (GET /genre/movie/list) che
// corrispondono 1:1 ai 10 valori del nostro enum Genere. TMDB ne espone
// qualcuno in piu' (Crime, Famiglia, Fantasy, Storia, Musica, Mistero,
// Guerra, Western, TV Movie): non hanno un corrispettivo nel nostro enum
// e quindi non compaiono qui, esattamente come un film Java "extra"
// genere sarebbe stato un errore di compilazione.
export const GENERE_TO_TMDB_ID: Record<Genere, number> = {
  DRAMMATICO: 18,
  COMMEDIA: 35,
  THRILLER: 53,
  AZIONE: 28,
  ANIMAZIONE: 16,
  FANTASCIENZA: 878,
  AVVENTURA: 12,
  SENTIMENTALE: 10749, // "Romance" lato TMDB
  HORROR: 27,
  DOCUMENTARIO: 99,
};

const TMDB_ID_TO_GENERE: Record<number, Genere> = Object.entries(GENERE_TO_TMDB_ID).reduce(
  (acc, [genere, id]) => {
    acc[id] = genere as Genere;
    return acc;
  },
  {} as Record<number, Genere>,
);

// Un film TMDB puo' avere piu' generi contemporaneamente (es. Azione +
// Fantascienza + Avventura); la nostra card mostra UN solo badge, quindi
// scegliamo il primo tra i generi TMDB del film che ha un corrispondente
// nel nostro enum, mantenendo l'ordine con cui TMDB li restituisce
// (di solito dal piu' al meno rilevante). Se nessuno dei generi TMDB del
// film rientra nei nostri 10, ripieghiamo su "DRAMMATICO" invece di
// lasciare il campo vuoto (la UI si aspetta sempre una stringa).
export function pickGenere(tmdbGenreIds: number[]): Genere {
  for (const id of tmdbGenreIds) {
    const g = TMDB_ID_TO_GENERE[id];
    if (g) return g;
  }
  return "DRAMMATICO";
}
