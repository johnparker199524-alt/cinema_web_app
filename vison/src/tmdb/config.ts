const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const DEFAULT_LANGUAGE = "it-IT";
const DEFAULT_REGION = "IT";
if (!TMDB_ACCESS_TOKEN && !TMDB_API_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "[tmdb] Nessuna chiave configurata: imposta VITE_TMDB_ACCESS_TOKEN oppure VITE_TMDB_API_KEY nel file .env (vedi .env.example).",
  );
}
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'%3E" +
  "%3Crect width='500' height='750' fill='%231a1f2e'/%3E" +
  "%3Ctext x='50%25' y='50%25' fill='%235b8cff' font-family='sans-serif' font-size='28' " +
  "text-anchor='middle' dominant-baseline='middle'%3ELocandina%3C/text%3E%3C/svg%3E";
export function posterUrl(
  path: string | null,
  size: "w342" | "w500" | "w780" = "w500",
): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
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
      ? {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        }
      : {
          accept: "application/json",
        },
  });
  if (!response.ok) {
    let message = `Errore TMDB ${response.status}`;
    try {
      const body = (await response.json()) as {
        status_message?: string;
      };
      if (body.status_message) message = body.status_message;
    } catch {}
    throw new Error(message);
  }
  return (await response.json()) as T;
}
export { DEFAULT_REGION };
