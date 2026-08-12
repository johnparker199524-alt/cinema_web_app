import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchNews } from "../features/news/newsSlice";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";

export default function News(): JSX.Element {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((s) => s.news);

    useEffect(() => { dispatch(fetchNews()); }, [dispatch]);
    return (
        <div className="container py-4">
            <BackButton label="News" />
            <h1 className="mb-4" style={{ color: "#5b8cff" }}>News</h1>
            {status === "loading" && <Loader />}
            <ErrorAlert message={error} />
            <div className="list-group">
                {items.map((n) => (
                    <Link key={n.id} to={`/news/${n.id}`}
                        className="list-group-item list-group-item-news bg-transparent border-secondary mb-2 rounded text-decoration-none d-flex align-items-center gap-3">
                        <img src={n.immagineUrl} className="news-thumb rounded" alt={n.titolo} />
                        <div>
                            <h5 style={{ color: "#dbe6ff" }}>{n.titolo}</h5>
                            {/* sommario, non contenuto: la slide mostra un riassunto nella lista */}
                            <p className="text-muted mb-1">{n.sommario}</p>
                            <small className="text-muted">{n.dataPubblicazione}</small>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
