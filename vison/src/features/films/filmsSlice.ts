import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFilmsByGenere } from "../../tmdb/filmsApi";
import type { FilmSummary, Genere, RequestStatus } from "../../types/cinema.types";
export const GENERI: Genere[] = [
  "DRAMMATICO",
  "COMMEDIA",
  "THRILLER",
  "AZIONE",
  "ANIMAZIONE",
  "FANTASCIENZA",
  "AVVENTURA",
  "SENTIMENTALE",
  "HORROR",
  "DOCUMENTARIO",
];
interface FilmsState {
  byGenere: Record<Genere, FilmSummary[]>;
  statusByGenere: Record<Genere, RequestStatus>;
  errorByGenere: Record<Genere, string | null>;
}
function buildInitialRecord<T>(value: T): Record<Genere, T> {
  return GENERI.reduce(
    (acc, genere) => {
      acc[genere] = value;
      return acc;
    },
    {} as Record<Genere, T>,
  );
}
const initialState: FilmsState = {
  byGenere: buildInitialRecord<FilmSummary[]>([]),
  statusByGenere: buildInitialRecord<RequestStatus>("idle"),
  errorByGenere: buildInitialRecord<string | null>(null),
};
export const fetchFilmsByGenere = createAsyncThunk<
  {
    genere: Genere;
    data: FilmSummary[];
  },
  Genere,
  {
    rejectValue: {
      genere: Genere;
      message: string;
    };
  }
>("films/fetchByGenere", async (genere, { rejectWithValue }) => {
  try {
    const data = await getFilmsByGenere(genere);
    return {
      genere,
      data,
    };
  } catch (err) {
    return rejectWithValue({
      genere,
      message: err instanceof Error ? err.message : "Errore sconosciuto",
    });
  }
});
const filmsSlice = createSlice({
  name: "films",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilmsByGenere.pending, (state, action) => {
        const genere = action.meta.arg;
        state.statusByGenere[genere] = "loading";
        state.errorByGenere[genere] = null;
      })
      .addCase(fetchFilmsByGenere.fulfilled, (state, action) => {
        const { genere, data } = action.payload;
        state.statusByGenere[genere] = "succeeded";
        state.byGenere[genere] = data;
      })
      .addCase(fetchFilmsByGenere.rejected, (state, action) => {
        const genere = action.payload?.genere ?? action.meta.arg;
        const message = action.payload?.message ?? "Errore sconosciuto";
        state.statusByGenere[genere] = "failed";
        state.errorByGenere[genere] = message;
      });
  },
});
export default filmsSlice.reducer;
