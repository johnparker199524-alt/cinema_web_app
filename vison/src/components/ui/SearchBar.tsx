import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  searchFilms,
  setQuery,
  clearResults,
} from "../../features/films/filmsSearchSlice";
const DEBOUNCE_MS = 400;
export default function SearchBar(): JSX.Element {
  const [testo, setTesto] = useState("");
  const dispatch = useAppDispatch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = testo.trim();
    if (query.length === 0) {
      dispatch(setQuery(""));
      dispatch(clearResults());
      return;
    }
    debounceRef.current = setTimeout(() => {
      dispatch(setQuery(query));
      dispatch(searchFilms(query));
    }, DEBOUNCE_MS);
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
