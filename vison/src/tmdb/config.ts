// Client per l'API pubblica di The Movie Database (TMDB) - https://www.themoviedb.org/
//
// TMDB supporta due modi di autenticazione:
//  1) v3 "API Key"           -> va passata come query param ?api_key=...
//  2) v4 "Read Access Token" -> va passata come header Authorization: Bearer ...
// Entrambe si ottengono gratuitamente da https://www.themoviedb.org/settings/api
// dopo essersi registrati. Qui supportiamo entrambe: se e' presente il
// Bearer token (VITE_TMDB_ACCESS_TOKEN) viene preferito, altrimenti si
// ripiega sulla API key "v3" (VITE_TMDB_API_KEY) come query param.
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

// Tutte le richieste vogliono i contenuti (titoli, generi, trame...) in
// italiano: TMDB traduce automaticamente i campi testuali quando la lingua
// e' disponibile, altrimenti ripiega sull'originale.
const DEFAULT_LANGUAGE = "it-IT";
// Regione usata per le date di uscita "locali" (calendario uscite in Italia).
const DEFAULT_REGION = "IT";

if (!TMDB_ACCESS_TOKEN && !TMDB_API_KEY) {
  // Errore "rumoroso" in console, non un throw: l'app deve comunque poter
  // avviarsi (es. per lavorare sulla UI), ma le chiamate a TMDB falliranno
  // finche' non viene configurata una chiave in .env (vedi .env.example).
  // eslint-disable-next-line no-console
  console.error(
    "[tmdb] Nessuna chiave configurata: imposta VITE_TMDB_ACCESS_TOKEN oppure VITE_TMDB_API_KEY nel file .env (vedi .env.example).",
  );
}

// Base per i poster/locandine. "w500" e' una buona via di mezzo tra
// qualita' e peso per le card del catalogo; per l'hero della pagina Trama
// si potrebbe usare "w780", ma w500 resta leggibile anche li'.
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Segnaposto per i film senza locandina: un semplice SVG inline come
// data: URI, NON un servizio esterno (es. placehold.co) — cosi' non serve
// aggiungere un altro dominio a img-src nella Content-Security-Policy
// (vedi index.html) e funziona anche offline/senza rete.
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'%3E" +
  "%3Crect width='500' height='750' fill='%231a1f2e'/%3E" +
  "%3Ctext x='50%25' y='50%25' fill='%235b8cff' font-family='sans-serif' font-size='28' " +
  "text-anchor='middle' dominant-baseline='middle'%3ELocandina%3C/text%3E%3C/svg%3E";

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" = "w500"): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

// Wrapper minimo su fetch: costruisce l'URL con base + query params comuni
// (lingua, eventuale api_key) e gestisce l'header Authorization quando si
// usa il Bearer token. Centralizzare qui la logica evita di ripetere in
// ogni funzione delle varie *Api.ts la gestione di autenticazione/errori.
export async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("language", DEFAULT_LANGUAGE);
  if (!TMDB_ACCESS_TOKEN && TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    headers: TMDB_ACCESS_TOKEN
      ? { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`, accept: "application/json" }
      : { accept: "application/json" },
  });

  if (!response.ok) {
    // TMDB restituisce un corpo JSON con "status_message" in caso di errore
    // (chiave mancante/non valida, risorsa non trovata, ecc.).
    let message = `Errore TMDB ${response.status}`;
    try {
      const body = (await response.json()) as { status_message?: string };
      if (body.status_message) message = body.status_message;
    } catch {
      // corpo non-JSON: manteniamo il messaggio generico
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export { DEFAULT_REGION };
