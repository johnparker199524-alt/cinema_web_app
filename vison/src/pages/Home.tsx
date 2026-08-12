import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchFilmsByGenere, GENERI } from "../features/films/filmsSlice";
import type { FilmSummary } from "../types/cinema.types";
import FilmCard from "../components/ui/FilmCard";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import SearchBar from "../components/ui/SearchBar";
import { consumeLastFilmId } from "../utils/lastFilm";

// Etichette leggibili per i 10 generi (l'enum/i valori restano in
// maiuscolo lato dati, qui solo per il titolo di sezione).
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

// Il Navbar (Home / Calendario Uscite / News) è globale, montato da
// <Layout> in App.tsx: qui c'è solo l'hero "marquee" (elemento distintivo
// della Home) e la barra di ricerca, che resta SOLO in questa pagina come
// richiesto. La ricerca è "live": <SearchBar/> aggiorna da sola lo slice
// filmsSearch mentre l'utente digita (con debounce), qui ci limitiamo a
// LEGGERLO. Quando query non è vuota, la pagina mostra i risultati della
// ricerca al posto delle sezioni per genere; quando si svuota il campo,
// si torna automaticamente alla vista normale (nessun cambio di pagina/URL).
export default function Home(): JSX.Element {
    const dispatch = useAppDispatch();

    // FIX: la Home mostrava solo Drammatico e Sentimentale perché lo
    // slice teneva due campi fissi. Ora filmsSlice espone un dizionario
    // per genere (byGenere/statusByGenere/errorByGenere) e GENERI elenca
    // tutti e 10 i generi: qui carichiamo TUTTI i generi in parallelo,
    // così ogni categoria del catalogo compare nella Home.
    const { byGenere, statusByGenere, errorByGenere } = useAppSelector(
        (s) => s.films,
    );

    const {
        query,
        results,
        status: searchStatus,
        error: searchError,
    } = useAppSelector((s) => s.filmsSearch);

    useEffect(() => {
        GENERI.forEach((genere) => dispatch(fetchFilmsByGenere(genere)));
    }, [dispatch]);

    // Film scelto nell'ultima visita alla scheda (Trama), se presente.
    // FIX: consumare la chiave dentro un initializer di useState (fatto
    // in precedenza) è un side-effect nel render, e React.StrictMode
    // (attivo in main.tsx) invoca DUE VOLTE quella funzione in sviluppo
    // per scovare proprio questo tipo di errore: la prima chiamata
    // rimuoveva davvero la chiave e restituiva l'id, la seconda la
    // trovava già vuota e restituiva null — ed era quel null a finire
    // nello state, quindi il film non veniva mai portato in primo piano.
    // Il consumo va invece fatto in un useEffect (side-effect legittimo
    // fuori dal render), aggiornando lo state SOLO se si ottiene un id
    // reale: così anche la seconda invocazione "fantasma" di StrictMode
    // (che troverà la chiave già svuotata) non sovrascrive con null il
    // valore corretto impostato dalla prima.
    const [lastFilmId, setLastFilmId] = useState<number | null>(null);
    const hasScrolledToLastFilm = useRef(false);

    useEffect(() => {
        const id = consumeLastFilmId();
        if (id !== null) setLastFilmId(id);
    }, []);

    const isSearching = query.trim().length > 0;

    // Tutte le sezioni per genere sono già caricate (o in caricamento):
    // dopo che l'ultima è "succeeded", se un film era stato scelto in
    // precedenza portiamolo in vista, così l'utente lo ritrova subito
    // senza dover scorrere tutta la pagina per cercarlo.
    const allLoaded = GENERI.every(
        (g) => statusByGenere[g] === "succeeded" || statusByGenere[g] === "failed",
    );
    useEffect(() => {
        if (isSearching || !allLoaded || !lastFilmId || hasScrolledToLastFilm.current) return;
        const el = document.getElementById(`film-card-${lastFilmId}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            hasScrolledToLastFilm.current = true;
        }
    }, [isSearching, allLoaded, lastFilmId]);

    // Porta il film scelto in testa alla sua sezione di genere, così è
    // "davanti" (primo elemento, immediatamente visibile) invece che in
    // una posizione qualsiasi della lista.
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

            <div className="mb-4 mx-auto" style={{ maxWidth: 480 }}>
                <SearchBar />
            </div>

            {isSearching ? (
                // ---- Vista di ricerca: sostituisce dinamicamente il contenuto
                // della Home mentre l'utente digita, senza cambiare pagina/URL ----
                <>
                    <h2 className="mb-3" style={{ color: "#5b8cff" }}>
                        Risultati per "{query}"
                    </h2>
                    {searchStatus === "loading" && <Loader />}
                    <ErrorAlert message={searchError} />
                    {searchStatus === "succeeded" && results.length === 0 && (
                        <p className="text-muted">Nessun film trovato.</p>
                    )}
                    {searchStatus === "succeeded" && results.length > 0 && (
                        <div className="row">
                            {results.map((f) => <FilmCard key={f.id} film={f} />)}
                        </div>
                    )}
                </>
            ) : (
                // ---- Vista normale: una sezione per ciascuno dei 10 generi,
                // ognuna con il proprio loader/errore indipendente. Una
                // sezione senza film (catalogo ancora vuoto per quel genere)
                // viene semplicemente omessa, per non riempire la Home di
                // titoli vuoti.
                <>
                    {GENERI.map((genere, indice) => {
                        const films = withLastFilmFirst(byGenere[genere]);
                        const status = statusByGenere[genere];
                        const error = errorByGenere[genere];
                        if (status === "succeeded" && films.length === 0) return null;

                        return (
                            <section key={genere} className="mb-4">
                                {/* "genere-title": ogni nome di genere entra scorrendo da
                                    sinistra con una sottolineatura dorata che si allunga
                                    subito dopo, a cascata (stesso ritmo delle card sotto,
                                    vedi --delay), invece di comparire tutto insieme. */}
                                <h2
                                    className="mb-3 genere-title"
                                    style={{ color: "#5b8cff", "--delay": `${indice * 0.08}s` } as CSSProperties}
                                >
                                    {GENERE_LABELS[genere] ?? genere}
                                </h2>
                                {status === "loading" && <Loader />}
                                <ErrorAlert message={error} />
                                <div className="row">
                                    {films.map((f) => <FilmCard key={f.id} film={f} />)}
                                </div>
                            </section>
                        );
                    })}
                </>
            )}
        </div>
    );
}
