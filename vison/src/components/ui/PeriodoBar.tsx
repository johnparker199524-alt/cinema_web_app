import { PERIODO_ORDINE, PERIODO_LABELS, type PeriodoUscita } from "../../types/cinema.types";

interface PeriodoBarProps {
    attivo: PeriodoUscita;
    onSelect: (periodo: PeriodoUscita) => void;
}

// La consegna ("Scegli Periodo -> Select") chiede un vero componente
// <select>, non dei bottoni: il valore mostrato nel campo è sempre il
// periodo attivo, che resta così "evidenziato" come richiesto dalla
// slide (equivalente alla classe "active" usata in precedenza sui
// bottoni). Cambiando la select si richiama subito onSelect, che in
// CalendarioUscite aggiorna lo stato Redux e ricarica i dati.
export default function PeriodoBar({ attivo, onSelect }: PeriodoBarProps): JSX.Element {
    return (
        <div className="mb-4" style={{ maxWidth: 260 }}>
            <label htmlFor="periodo-select" className="form-label" style={{ color: "var(--cinema-accent)" }}>
                Scegli periodo
            </label>
            <select
                id="periodo-select"
                className="form-select periodo-select"
                value={attivo}
                onChange={(e) => onSelect(e.target.value as PeriodoUscita)}
            >
                {PERIODO_ORDINE.map((p) => (
                    <option key={p} value={p}>
                        {PERIODO_LABELS[p]}
                    </option>
                ))}
            </select>
        </div>
    );
}
