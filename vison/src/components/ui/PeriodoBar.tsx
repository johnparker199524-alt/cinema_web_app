import {
  PERIODO_ORDINE,
  PERIODO_LABELS,
  type PeriodoUscita,
} from "../../types/cinema.types";
interface PeriodoBarProps {
  attivo: PeriodoUscita;
  onSelect: (periodo: PeriodoUscita) => void;
}
export default function PeriodoBar({ attivo, onSelect }: PeriodoBarProps): JSX.Element {
  return (
    <div
      className="mb-4"
      style={{
        maxWidth: 260,
      }}
    >
      <label
        htmlFor="periodo-select"
        className="form-label"
        style={{
          color: "var(--cinema-accent)",
        }}
      >
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
