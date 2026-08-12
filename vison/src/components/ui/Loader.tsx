// Loader.tsx — bobina di pellicola che gira, al posto dello spinner
// generico di Bootstrap: un dettaglio piccolo ma coerente col soggetto.
export default function Loader(): JSX.Element {
    return (
        <div className="d-flex justify-content-center py-5">
            <div className="film-reel-loader" role="status">
                <span className="visually-hidden">Caricamento...</span>
            </div>
        </div>
    );
}
