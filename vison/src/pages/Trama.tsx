import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchFilmDetail } from "../features/films/filmDetailSlice";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";

// Riproduce l'header "Home    Trama" mostrato nelle slide di dettaglio
// (es. "Campo di Battaglia", "Never Let Go", "Joker: Folie à Deux"...),
// con in più il pulsante "Indietro" richiesto esplicitamente.
export default function Trama(): JSX.Element | null {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector((s) => s.filmDetail);
    useEffect(() => {
        if (id) dispatch(fetchFilmDetail(Number(id)));
    }, [dispatch, id]);

    return (
        <div className="container py-4">
            <BackButton label="Trama" />

            {status === "loading" && <Loader />}
            <ErrorAlert message={error} />

            {data && (
                <>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <img src={data.immagineUrl} className="img-fluid detail-hero-img rounded" alt={data.titolo} />
                        </div>
                        <div className="col-md-8">
                            <h1 style={{ color: "#5b8cff" }}>{data.titolo}</h1>
                            <p className="text-muted">{data.regista} — {data.anno} — {data.distributore}</p>
                            <p>{data.descrizione}</p>
                        </div>
                    </div>

                    {/* Trailer (da TMDB, GET /movie/{id}/videos): embed YouTube in
                        modalita' privacy (youtube-nocookie.com), a tutta larghezza
                        sotto la scheda cosi' il player ha spazio per respirare,
                        dentro una cornice coerente col resto del tema (bordo +
                        glow oro all'hover, stesso linguaggio delle card film).
                        Se il film non ha un trailer disponibile, un placeholder
                        con icona al posto di un player vuoto o di solo testo. */}
                    <h2 className="mt-4 mb-3 genere-title" style={{ color: "var(--cinema-gold)" }}>
                        Trailer
                    </h2>
                    {data.trailerUrl ? (
                        <div className="trailer-frame">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={data.trailerUrl}
                                    title={`Trailer di ${data.titolo}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="trailer-frame trailer-placeholder">
                            <i className="bi bi-film" aria-hidden="true" />
                            <p className="mb-0">Trailer non disponibile per questo film.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
