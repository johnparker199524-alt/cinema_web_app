// Chiave localStorage condivisa tra FilmCard (che la scrive quando si
// apre un film) e Home (che la legge al montaggio per riportare in
// primo piano l'ultimo film scelto). Centralizzata qui per evitare che
// la stringa "magica" venga ridigitata/errata in due file diversi.
export const LAST_FILM_STORAGE_KEY = "cinema:lastFilmId";

// FIX: "consuma" il valore, non lo legge soltanto. Prima usavamo una
// semplice lettura (getItem) che lasciava il valore in localStorage per
// sempre: risultato, anche ricaricando la pagina Home con F5 (quindi
// senza essere appena tornati dalla scheda di un film) l'id restava lì
// e la Home continuava a riportare "in primo piano" lo stesso film
// all'infinito. Rimuovendo la chiave subito dopo averla letta, il
// comportamento "porta in primo piano il film scelto" scatta una sola
// volta, esattamente al ritorno dalla scheda Trama: un successivo
// ricaricamento della Home (F5, apertura diretta dell'URL, ecc.) non
// trova più nulla in storage e mostra quindi la pagina "pulita",
// dall'inizio, come atteso.
export function consumeLastFilmId(): number | null {
  const raw = localStorage.getItem(LAST_FILM_STORAGE_KEY);
  if (!raw) return null;
  localStorage.removeItem(LAST_FILM_STORAGE_KEY);
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}
