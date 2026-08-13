import { Link, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
interface BackButtonProps {
  label: string;
}
const breadcrumbStyle: CSSProperties = {
  "--bs-breadcrumb-divider": "'>'",
} as CSSProperties;
export default function BackButton({ label }: BackButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
      <button
        type="button"
        className="btn btn-periodo btn-back btn-sm d-inline-flex align-items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Indietro
      </button>

      <nav aria-label="breadcrumb" className="mb-0">
        <ol className="breadcrumb mb-0" style={breadcrumbStyle}>
          <li className="breadcrumb-item">
            <Link
              to="/"
              className="text-decoration-none"
              style={{
                color: "var(--cinema-accent)",
              }}
            >
              Home
            </Link>
          </li>
          <li className="breadcrumb-item active text-white-50" aria-current="page">
            {label}
          </li>
        </ol>
      </nav>
    </div>
  );
}
