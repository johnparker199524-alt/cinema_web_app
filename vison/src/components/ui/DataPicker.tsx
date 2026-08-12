interface DataPickerProps {
    valore: string | null;
    onChange: (data: string) => void;
}

// Affianca il dropdown "Scegli periodo": qui l'utente sceglie una data
// LIBERA (calendario nativo del browser) invece di una delle 5 settimane
// predefinite, così può controllare "ci sono uscite il 9 settembre 2024?"
// esattamente come mostrato nella slide del project work.
export default function DataPicker({ valore, onChange }: DataPickerProps): JSX.Element {
    return (
        <div className="mb-4" style={{ maxWidth: 260 }}>
            <label htmlFor="data-uscita-input" className="form-label" style={{ color: "var(--cinema-accent)" }}>
                ...oppure scegli una data
            </label>
            <input
                id="data-uscita-input"
                type="date"
                className="form-control periodo-select"
                value={valore ?? ""}
                onChange={(e) => {
                    if (e.target.value) onChange(e.target.value);
                }}
            />
        </div>
    );
}
