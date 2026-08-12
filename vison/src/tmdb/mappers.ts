import type { FilmCalendario, FilmDetail, FilmSummary } from "../types/cinema.types";
import { posterUrl } from "./config";
import { pickGenere } from "./genereMap";
import type { TmdbMovieDetail, TmdbMovieListItem } from "./tmdb.types";

export function toFilmSummary(m: TmdbMovieListItem): FilmSummary {
  return {
    id: m.id,
    titolo: m.title,
    immagineUrl: posterUrl(m.poster_path),
    genere: pickGenere(m.genre_ids),
  };
}

function annoFromDataUscita(dataUscita: string): number {
  const anno = Number(dataUscita.slice(0, 4));
  return Number.isNaN(anno) ? 0 : anno;
}

function registaFromDetail(m: TmdbMovieDetail): string {
  const regista = m.credits?.crew.find((c) => c.job === "Director");
  return regista?.name ?? "Regista sconosciuto";
}

function distributoreFromDetail(m: TmdbMovieDetail): string {
  return m.production_companies[0]?.name ?? "";
}

// Sceglie il "miglior" video da mostrare come trailer: preferisce un
// Trailer YouTube marcato "official" da TMDB, poi un Trailer YouTube
// qualsiasi, poi un Teaser YouTube come ripiego; se non c'e' nulla di
// utilizzabile ritorna null (la UI mostra un messaggio invece del player).
// youtube-nocookie.com invece di youtube.com: player in modalita' privacy
// avanzata, nessun cookie di tracciamento finche' l'utente non interagisce
// (e coerente col dominio autorizzato in frame-src nella CSP, vedi index.html).
function trailerUrlFromDetail(m: TmdbMovieDetail): string | null {
  const video = m.videos?.results ?? [];
  const trailerUfficiale = video.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
  );
  const trailerQualsiasi = video.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const teaser = video.find((v) => v.site === "YouTube" && v.type === "Teaser");
  const scelto = trailerUfficiale ?? trailerQualsiasi ?? teaser;
  return scelto ? `https://www.youtube-nocookie.com/embed/${scelto.key}` : null;
}

export function toFilmDetail(m: TmdbMovieDetail): FilmDetail {
  return {
    id: m.id,
    titolo: m.title,
    immagineUrl: posterUrl(m.poster_path, "w780"),
    genere: m.genres.length > 0 ? pickGenere(m.genres.map((g) => g.id)) : "DRAMMATICO",
    descrizione: m.overview || "Trama non disponibile.",
    distributore: distributoreFromDetail(m),
    anno: annoFromDataUscita(m.release_date),
    dataUscita: m.release_date,
    regista: registaFromDetail(m),
    trailerUrl: trailerUrlFromDetail(m),
  };
}

export function toFilmCalendario(m: TmdbMovieDetail): FilmCalendario {
  const detail = toFilmDetail(m);
  return {
    id: detail.id,
    titolo: detail.titolo,
    immagineUrl: detail.immagineUrl,
    genere: detail.genere,
    anno: detail.anno,
    dataUscita: detail.dataUscita,
    regista: detail.regista,
    distributore: detail.distributore,
  };
}
