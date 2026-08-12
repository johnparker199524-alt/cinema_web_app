import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getFilmByPeriodo, getFilmByData } from "../../tmdb/calendarioApi";
import type {
  FilmCalendario,
  FilmSummary,
  PeriodoUscita,
  RequestStatus,
} from "../../types/cinema.types";

// La pagina Calendario Uscite ha ora DUE modalità di ricerca, mutuamente
// esclusive: quella "storica" per periodo (dropdown a 5 settimane) e quella
// nuova per data specifica (calendario libero, come richiesto dalla slide:
// "Select -> Uscite del 9 settembre 2024... ecc"). "modalita" dice alla UI
// quale dei due risultati mostrare in questo momento.
type ModalitaCalendario = "periodo" | "data";

interface CalendarioState {
  modalita: ModalitaCalendario;

  // ---- Ricerca per periodo (dropdown) ----
  items: FilmCalendario[];
  periodo: PeriodoUscita; // quale label è "evidenziata" in questo momento
  status: RequestStatus;
  error: string | null;

  // ---- Ricerca per data specifica (input <input type="date">) ----
  itemsData: FilmSummary[];
  dataSelezionata: string | null; // formato YYYY-MM-DD, quello che manda <input type="date">
  statusData: RequestStatus;
  errorData: string | null;
}

const initialState: CalendarioState = {
  modalita: "periodo",
  items: [],
  periodo: "QUESTA_SETTIMANA",
  status: "idle",
  error: null,
  itemsData: [],
  dataSelezionata: null,
  statusData: "idle",
  errorData: null,
};

export const fetchCalendarioByPeriodo = createAsyncThunk<
  FilmCalendario[],
  PeriodoUscita,
  { rejectValue: string }
>("calendario/fetchByPeriodo", async (periodo, { rejectWithValue }) => {
  try {
    return await getFilmByPeriodo(periodo);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Errore sconosciuto",
    );
  }
});

// Riusa la stessa logica di calcolo di /calendario/data (calendarioApi.ts):
// riceve una data "YYYY-MM-DD" e restituisce i film considerati "in sala"
// in quel giorno (finestra di 1 mese centrata sulla data, stessa logica
// di /in-programmazione).
export const fetchCalendarioByData = createAsyncThunk<
  FilmSummary[],
  string,
  { rejectValue: string }
>("calendario/fetchByData", async (data, { rejectWithValue }) => {
  try {
    return await getFilmByData(data);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Errore sconosciuto",
    );
  }
});

const calendarioSlice = createSlice({
  name: "calendario",
  initialState,
  reducers: {
    // azione sincrona: solo per aggiornare la label attiva PRIMA che
    // arrivi la risposta, così il bottone si evidenzia subito al click,
    // non solo a fetch completata. Riporta anche la pagina in modalità
    // "periodo" (nel caso l'utente stesse guardando i risultati di una
    // data specifica).
    setPeriodoAttivo: (state, action: PayloadAction<PeriodoUscita>) => {
      state.periodo = action.payload;
      state.modalita = "periodo";
    },
    // Aggiorna la data scelta nel campo <input type="date"> e passa la
    // pagina in modalità "data": il fetch vero parte dall'effect in
    // CalendarioUscite.tsx quando "dataSelezionata" cambia.
    setDataSelezionata: (state, action: PayloadAction<string>) => {
      state.dataSelezionata = action.payload;
      state.modalita = "data";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarioByPeriodo.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchCalendarioByPeriodo.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchCalendarioByPeriodo.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Errore";
      })
      .addCase(fetchCalendarioByData.pending, (s) => {
        s.statusData = "loading";
      })
      .addCase(fetchCalendarioByData.fulfilled, (s, a) => {
        s.statusData = "succeeded";
        s.itemsData = a.payload;
      })
      .addCase(fetchCalendarioByData.rejected, (s, a) => {
        s.statusData = "failed";
        s.errorData = a.payload ?? "Errore";
      });
  },
});

export const { setPeriodoAttivo, setDataSelezionata } = calendarioSlice.actions;
export default calendarioSlice.reducer;
