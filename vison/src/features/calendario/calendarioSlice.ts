import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getFilmByPeriodo, getFilmByData } from "../../tmdb/calendarioApi";
import type {
  FilmCalendario,
  FilmSummary,
  PeriodoUscita,
  RequestStatus,
} from "../../types/cinema.types";
type ModalitaCalendario = "periodo" | "data";
interface CalendarioState {
  modalita: ModalitaCalendario;
  items: FilmCalendario[];
  periodo: PeriodoUscita;
  status: RequestStatus;
  error: string | null;
  itemsData: FilmSummary[];
  dataSelezionata: string | null;
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
  {
    rejectValue: string;
  }
>("calendario/fetchByPeriodo", async (periodo, { rejectWithValue }) => {
  try {
    return await getFilmByPeriodo(periodo);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Errore sconosciuto");
  }
});
export const fetchCalendarioByData = createAsyncThunk<
  FilmSummary[],
  string,
  {
    rejectValue: string;
  }
>("calendario/fetchByData", async (data, { rejectWithValue }) => {
  try {
    return await getFilmByData(data);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Errore sconosciuto");
  }
});
const calendarioSlice = createSlice({
  name: "calendario",
  initialState,
  reducers: {
    setPeriodoAttivo: (state, action: PayloadAction<PeriodoUscita>) => {
      state.periodo = action.payload;
      state.modalita = "periodo";
    },
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
