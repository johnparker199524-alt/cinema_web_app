export interface FilmSummary {
  id: number;
  titolo: string;
  immagineUrl: string;
  genere: string;
}
export interface FilmDetail {
  id: number;
  titolo: string;
  immagineUrl: string;
  genere: string;
  descrizione: string;
  distributore: string;
  anno: number;
  dataUscita: string;
  regista: string;
  trailerUrl: string | null;
}
export interface FilmCalendario {
  id: number;
  titolo: string;
  immagineUrl: string;
  genere: string;
  anno: number;
  dataUscita: string;
  regista: string;
  distributore: string;
}
export interface NewsArticle {
  id: number;
  titolo: string;
  immagineUrl: string;
  sommario: string;
  contenuto: string;
  dataPubblicazione: string;
}
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
export type Genere =
  | "DRAMMATICO"
  | "COMMEDIA"
  | "THRILLER"
  | "AZIONE"
  | "ANIMAZIONE"
  | "FANTASCIENZA"
  | "AVVENTURA"
  | "SENTIMENTALE"
  | "HORROR"
  | "DOCUMENTARIO";
export type PeriodoUscita =
  | "SCORSA_SETTIMANA"
  | "QUESTA_SETTIMANA"
  | "TRA_1_SETTIMANA"
  | "TRA_2_SETTIMANE"
  | "TRA_3_SETTIMANE";
export const PERIODO_LABELS: Record<PeriodoUscita, string> = {
  SCORSA_SETTIMANA: "Scorsa	settimana",
  QUESTA_SETTIMANA: "Questa	settimana",
  TRA_1_SETTIMANA: "Tra	1	settimana",
  TRA_2_SETTIMANE: "Tra	2	settimane",
  TRA_3_SETTIMANE: "Tra	3	settimane",
};
export const PERIODO_ORDINE: PeriodoUscita[] = [
  "SCORSA_SETTIMANA",
  "QUESTA_SETTIMANA",
  "TRA_1_SETTIMANA",
  "TRA_2_SETTIMANE",
  "TRA_3_SETTIMANE",
];
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
