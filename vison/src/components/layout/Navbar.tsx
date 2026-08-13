import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  return (
    <nav className="navbar navbar-expand-lg navbar-cinema navbar-dark sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/" end>
          <span className="brand-icon" aria-hidden="true">
            🎬
          </span>
          <span className="brand-text">CinemaWebApp</span>
        </NavLink>

        <button
          type="button"
          className={`navbar-hamburger${isOpen ? " is-open" : ""}`}
          aria-expanded={isOpen}
          aria-controls="main-nav-links"
          aria-label={isOpen ? "Chiudi il menu" : "Apri il menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="navbar-hamburger-bar" aria-hidden="true"></span>
          <span className="navbar-hamburger-bar" aria-hidden="true"></span>
          <span className="navbar-hamburger-bar" aria-hidden="true"></span>
        </button>

        <div
          id="main-nav-links"
          className={`navbar-nav ms-auto gap-3${isOpen ? " is-open" : ""}`}
        >
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
