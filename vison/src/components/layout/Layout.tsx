import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

// La Navbar (Home / Calendario Uscite / News) viene mostrata SOLO
// nella Home ("/"). Nelle altre pagine (Trama, Calendario, News, ecc.)
// la navigazione è affidata al BackButton di ciascuna pagina.
// Il Footer resta invece su tutte le pagine.
export default function Layout({ children }: LayoutProps): JSX.Element {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      {isHome && <Navbar />}
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
