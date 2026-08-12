import { NavLink } from "react-router-dom";

// La consegna mostra l'header "Home | Calendario Uscite | News" su OGNI
// schermata del mockup (slide 4, 5, 18-23...), quindi questo componente è
// ora montato globalmente da <Layout> in App.tsx e appare su tutte le
// pagine. La ricerca (dinamica, con debounce) è stata spostata nel
// componente <SearchBar/>, che resta montato SOLO nella Home, come
// richiesto: qui non c'è più alcun campo di ricerca.
export default function Navbar(): JSX.Element {
  return (
    <nav className="navbar navbar-expand-lg navbar-cinema navbar-dark sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/" end>
          <span className="brand-icon" aria-hidden="true">🎬</span>
          <span className="brand-text">CinemaWebApp</span>
        </NavLink>
        <div className="navbar-nav ms-auto gap-3">
          <NavLink className="nav-link" to="/" end>
            Home
          </NavLink>
          <NavLink className="nav-link" to="/calendario">
            Calendario Uscite
          </NavLink>
          <NavLink className="nav-link" to="/news">
            News
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
