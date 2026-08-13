import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchCalendarioByPeriodo,
  fetchCalendarioByData,
  setPeriodoAttivo,
  setDataSelezionata,
} from "../features/calendario/calendarioSlice";
import PeriodoBar from "../components/ui/PeriodoBar";
import DataPicker from "../components/ui/DataPicker";
import FilmCalendarioCard from "../components/ui/FilmCalendarioCard";
import FilmCard from "../components/ui/FilmCard";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";
import type { PeriodoUscita } from "../types/cinema.types";
function formattaDataItaliana(isoDate: string): string {
  const [anno, mese, giorno] = isoDate.split("-");
  return `${giorno}/${mese}/${anno}`;
}
export default function CalendarioUscite(): JSX.Element {
  const dispatch = useAppDispatch();
  const {
    modalita,
    items,
    periodo,
    status,
    error,
    itemsData,
    dataSelezionata,
    statusData,
    errorData,
  } = useAppSelector((s) => s.calendario);
  useEffect(() => {
    dispatch(fetchCalendarioByPeriodo(periodo));
  }, [dispatch, periodo]);
  useEffect(() => {
    if (dataSelezionata) dispatch(fetchCalendarioByData(dataSelezionata));
  }, [dispatch, dataSelezionata]);
  const handleSelectPeriodo = (p: PeriodoUscita) => {
    dispatch(setPeriodoAttivo(p));
  };
  const handleSelectData = (data: string) => {
    dispatch(setDataSelezionata(data));
  };
  const inModalitaData = modalita === "data" && dataSelezionata !== null;
  return (
    <div className="container py-4">
      <BackButton label="Calendario Uscite" />
      <h1
        className="mb-4"
        style={{
          color: "#5b8cff",
        }}
      >
        Calendario Uscite
      </h1>

      <div id="calendario-filtri" className="d-flex flex-wrap gap-4 align-items-start">
        <PeriodoBar attivo={periodo} onSelect={handleSelectPeriodo} />
        <DataPicker valore={dataSelezionata} onChange={handleSelectData} />
      </div>

      {inModalitaData ? (
        <>
          <h2
            className="mb-3 genere-title"
            style={{
              color: "var(--cinema-gold)",
            }}
          >
            Uscite del {formattaDataItaliana(dataSelezionata)}
          </h2>
          {statusData === "loading" && <Loader />}
          <ErrorAlert message={errorData} />
          {statusData === "succeeded" && itemsData.length === 0 && (
            <p className="text-muted">
              Nessun film in programmazione per il {formattaDataItaliana(dataSelezionata)}
              . Prova a scegliere un'altra data.
            </p>
          )}
          {statusData === "succeeded" && itemsData.length > 0 && (
            <div className="row">
              {itemsData.map((f) => (
                <FilmCard key={f.id} film={f} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {status === "loading" && <Loader />}
          <ErrorAlert message={error} />
          {status === "succeeded" && items.length === 0 && (
            <p className="text-muted">Nessun film in uscita in questo periodo.</p>
          )}
          <div className="row">
            {items.map((f) => (
              <FilmCalendarioCard key={f.id} film={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
