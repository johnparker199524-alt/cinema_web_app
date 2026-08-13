import { Link } from "react-router-dom";
import type { FilmSummary } from "../../types/cinema.types";
import { LAST_FILM_STORAGE_KEY } from "../../utils/lastFilm";
interface FilmCardProps {
  film: FilmSummary;
}
export default function FilmCard({ film }: FilmCardProps): JSX.Element {
  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4" id={`film-card-${film.id}`}>
      <Link
        to={`/trama/${film.id}`}
        className="text-decoration-none"
        onClick={() => localStorage.setItem(LAST_FILM_STORAGE_KEY, String(film.id))}
      >
        <div className="card	card-film	h-100">
          <img src={film.immagineUrl} className="card-img-top" alt={film.titolo} />
          <div className="card-body">
            <span className="badge	badge-genere	mb-2">{film.genere}</span>
            <h5 className="card-title">{film.titolo}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
}
