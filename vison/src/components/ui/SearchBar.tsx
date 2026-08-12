import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { searchFilms, setQuery, clearResults } from "../../features/films/filmsSearchSlice";

// Ricerca "live" e dinamica (estratta dalla vecchia Navbar, comportamento
// invariato): ad ogni carattere digitato si aggiorna subito l'input
// (stato locale "testo"), ma il dispatch verso l'API viene ritardato di
// 400ms (debounce) con un setTimeout: se l'utente continua a digitare,
// il timeout precedente viene cancellato e se ne pianifica uno nuovo.
// Questo componente è montato SOLO nella Home (vedi Home.tsx), come
// richiesto: nessun'altra pagina mostra la barra di ricerca.
const DEBOUNCE_MS = 400;

export default function SearchBar(): JSX.Element {
  const [testo, setTesto] = useState("");
  const dispatch = useAppDispatch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Ogni volta che "testo" cambia, si cancella l'eventuale timer
    // precedente ancora in attesa (debounce vero e proprio).
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = testo.trim();

    if (query.length === 0) {
      // Campo svuotato: puliamo subito i risultati, senza aspettare
      // il debounce (non c'è nessuna chiamata da "ritardare" qui).
      dispatch(setQuery(""));
      dispatch(clearResults());
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(setQuery(query));
      dispatch(searchFilms(query));
    }, DEBOUNCE_MS);

    // Cleanup: se il componente si smonta o "testo" cambia di nuovo
    // prima che scatti il timeout, quel timeout va cancellato.
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [testo, dispatch]);

  return (
    <form
      className="search-bar-home d-flex flex-column flex-sm-row gap-2"
      onSubmit={(e) => e.preventDefault()}
      role="search"
    >
      <input
        type="search"
        className="form-control"
        placeholder="Cerca un film..."
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
        aria-label="Cerca un film"
      />
      <button className="btn btn-periodo" type="submit">
        Cerca
      </button>
    </form>
  );
}
