interface DataPickerProps {
  valore: string | null;
  onChange: (data: string) => void;
}
export default function DataPicker({ valore, onChange }: DataPickerProps): JSX.Element {
  return (
    <div
      className="mb-4"
      style={{
        maxWidth: 260,
      }}
    >
      <label
        htmlFor="data-uscita-input"
        className="form-label"
        style={{
          color: "var(--cinema-accent)",
        }}
      >
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
