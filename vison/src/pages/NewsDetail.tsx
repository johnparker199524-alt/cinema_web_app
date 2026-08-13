import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchNewsDetail } from "../features/news/newsDetailSlice";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";
export default function NewsDetail(): JSX.Element | null {
  const { id } = useParams<{
    id: string;
  }>();
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((s) => s.newsDetail);
  useEffect(() => {
    if (id) dispatch(fetchNewsDetail(Number(id)));
  }, [dispatch, id]);
  return (
    <div className="container py-4">
      <BackButton label="News" />

      {status === "loading" && <Loader />}
      <ErrorAlert message={error} />

      {data && (
        <>
          <img
            src={data.immagineUrl}
            className="img-fluid detail-hero-img rounded mb-3"
            alt={data.titolo}
          />
          <h1
            style={{
              color: "#5b8cff",
            }}
          >
            {data.titolo}
          </h1>
          <p>{data.contenuto}</p>
        </>
      )}
    </div>
  );
}
