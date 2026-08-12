import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router NON riporta da solo lo scroll in cima quando si cambia
// pagina (a differenza di una navigazione "tradizionale" con reload).
// Montato una sola volta dentro <Layout>, così su OGNI cambio di rotta
// (click sull'icona 🎬, su "Home", "Calendario Uscite", "News", sul
// pulsante "Indietro"...) la pagina riparte dall'alto invece di restare
// scrollata dov'era sulla pagina precedente. Nella Home, se l'utente sta
// tornando dalla scheda di un film, Home.tsx sposta poi lo scroll fino
// a quella card con un secondo effetto: i due comportamenti non vanno
// in conflitto perché quello della Home scatta un istante dopo, quando
// i dati del film sono pronti.
export default function ScrollToTop(): null {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
}
