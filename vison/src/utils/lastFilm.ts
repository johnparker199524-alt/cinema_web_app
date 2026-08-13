export const LAST_FILM_STORAGE_KEY = "cinema:lastFilmId";
export function consumeLastFilmId(): number | null {
  const raw = localStorage.getItem(LAST_FILM_STORAGE_KEY);
  if (!raw) return null;
  localStorage.removeItem(LAST_FILM_STORAGE_KEY);
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}
