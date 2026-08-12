import { Link } from 'react-router-dom'

export default function NotFound(): JSX.Element {
    return (
        <div className="container	py-5	text-center">
            <h1 style={{ color: "#5b8cff" }}>404</h1>
            <p className="text-muted">La	pagina	che	cerchi	non	esiste.</p>
            <Link to="/" className="btn	btn-periodo	mt-3">Torna	alla	Home</Link>
        </div>
    )
}