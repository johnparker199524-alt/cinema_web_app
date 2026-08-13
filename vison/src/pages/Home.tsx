import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchFilmsByGenere, GENERI } from "../features/films/filmsSlice";
import type { FilmSummary } from "../types/cinema.types";
import FilmCard from "../components/ui/FilmCard";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import SearchBar from "../components/ui/SearchBar";
import { consumeLastFilmId } from "../utils/lastFilm";
const GENERE_LABELS: Record<string, string> = {
  DRAMMATICO: "Drammatico",
  COMMEDIA: "Commedia",
  THRILLER: "Thriller",
  AZIONE: "Azione",
  ANIMAZIONE: "Animazione",
  FANTASCIENZA: "Fantascienza",
  AVVENTURA: "Avventura",
  SENTIMENTALE: "Sentimentale",
  HORROR: "Horror",
  DOCUMENTARIO: "Documentario",
};
export default function Home(): JSX.Element {
  const dispatch = useAppDispatch();
  const { byGenere, statusByGenere, errorByGenere } = useAppSelector((s) => s.films);
  const {
    query,
    results,
    status: searchStatus,
    error: searchError,
  } = useAppSelector((s) => s.filmsSearch);
  useEffect(() => {
    GENERI.forEach((genere) => dispatch(fetchFilmsByGenere(genere)));
  }, [dispatch]);
  const [lastFilmId, setLastFilmId] = useState<number | null>(null);
  const hasScrolledToLastFilm = useRef(false);
  useEffect(() => {
    const id = consumeLastFilmId();
    if (id !== null) setLastFilmId(id);
  }, []);
  const isSearching = query.trim().length > 0;
  const allLoaded = GENERI.every(
    (g) => statusByGenere[g] === "succeeded" || statusByGenere[g] === "failed",
  );
  useEffect(() => {
    if (isSearching || !allLoaded || !lastFilmId || hasScrolledToLastFilm.current) return;
    const el = document.getElementById(`film-card-${lastFilmId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasScrolledToLastFilm.current = true;
    }
  }, [isSearching, allLoaded, lastFilmId]);
  function withLastFilmFirst(films: FilmSummary[]): FilmSummary[] {
    if (!lastFilmId) return films;
    const idx = films.findIndex((f) => f.id === lastFilmId);
    if (idx <= 0) return films;
    const copy = films.slice();
    const [chosen] = copy.splice(idx, 1);
    copy.unshift(chosen);
    return copy;
  }
  return (
    <div className="container py-4">
      <div className="hero-marquee">
        <h1>CINEMA WEB APP</h1>
        <p>Le trame, le uscite e le news del cinema, tutte in un unico posto.</p>
      </div>

      <div
        className="mb-4 mx-auto"
        style={{
          maxWidth: 480,
        }}
      >
        <SearchBar />
      </div>

      {isSearching ? (
        <>
          <h2
            className="mb-3"
            style={{
              color: "#5b8cff",
            }}
          >
            Risultati per "{query}"
          </h2>
          {searchStatus === "loading" && <Loader />}
          <ErrorAlert message={searchError} />
          {searchStatus === "succeeded" && results.length === 0 && (
            <p className="text-muted">Nessun film trovato.</p>
          )}
          {searchStatus === "succeeded" && results.length > 0 && (
            <div className="row">
              {results.map((f) => (
                <FilmCard key={f.id} film={f} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {GENERI.map((genere, indice) => {
            const films = withLastFilmFirst(byGenere[genere]);
            const status = statusByGenere[genere];
            const error = errorByGenere[genere];
            if (status === "succeeded" && films.length === 0) return null;
            return (
              <section key={genere} className="mb-4">
                <h2
                  className="mb-3 genere-title"
                  style={
                    {
                      color: "#5b8cff",
                      "--delay": `${indice * 0.08}s`,
                    } as CSSProperties
                  }
                >
                  {GENERE_LABELS[genere] ?? genere}
                </h2>
                {status === "loading" && <Loader />}
                <ErrorAlert message={error} />
                <div className="row">
                  {films.map((f) => (
                    <FilmCard key={f.id} film={f} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
