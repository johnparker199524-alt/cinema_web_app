import { Link } from "react-router-dom";
import type { FilmCalendario } from "../../types/cinema.types";
interface FilmCalendarioCardProps {
  film: FilmCalendario;
}
export default function FilmCalendarioCard({
  film,
}: FilmCalendarioCardProps): JSX.Element {
  return (
    <div className="col-md-6 mb-4">
      <Link to={`/trama/${film.id}`} className="text-decoration-none">
        <div className="card card-film h-100 flex-md-row">
          <img src={film.immagineUrl} className="card-calendario-img" alt={film.titolo} />
          <div className="card-body">
            <h5 className="card-title">{film.titolo}</h5>
            <p className="mb-1 text-muted small">{film.distributore}</p>
            <p className="mb-0 small">Genere: {film.genere}</p>
            <p className="mb-0 small">Anno: {film.anno}</p>
            <p className="mb-0 small">Uscita: {film.dataUscita}</p>
            <p className="mb-0 small">Regia: {film.regista}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
