import type { Genere } from "../types/cinema.types";
export const GENERE_TO_TMDB_ID: Record<Genere, number> = {
  DRAMMATICO: 18,
  COMMEDIA: 35,
  THRILLER: 53,
  AZIONE: 28,
  ANIMAZIONE: 16,
  FANTASCIENZA: 878,
  AVVENTURA: 12,
  SENTIMENTALE: 10749,
  HORROR: 27,
  DOCUMENTARIO: 99,
};
const TMDB_ID_TO_GENERE: Record<number, Genere> = Object.entries(
  GENERE_TO_TMDB_ID,
).reduce(
  (acc, [genere, id]) => {
    acc[id] = genere as Genere;
    return acc;
  },
  {} as Record<number, Genere>,
);
export function pickGenere(tmdbGenreIds: number[]): Genere {
  for (const id of tmdbGenreIds) {
    const g = TMDB_ID_TO_GENERE[id];
    if (g) return g;
  }
  return "DRAMMATICO";
}
