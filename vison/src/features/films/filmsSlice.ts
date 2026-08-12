import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFilmsByGenere } from "../../tmdb/filmsApi";
import type {
  FilmSummary,
  Genere,
  RequestStatus,
} from "../../types/cinema.types";

// Elenco dei 10 generi ammessi, nello stesso ordine dell'enum Java
// spring.CinemaApp.entity.Genere. Usato sia qui per inizializzare lo
// stato sia in Home.tsx per iterare le sezioni della pagina: aggiungere
// un genere in futuro richiede di toccare SOLO questo array (più
// l'enum lato Java e il type "Genere" in cinema.types.ts).
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

// FIX: prima lo stato aveva due campi fissi (drammatico/sentimentale +
// relativi status/error), quindi la Home poteva mostrare solo quei due
// generi "cablati" a mano. Sostituito con un dizionario indicizzato per
// Genere: ogni genere ha la propria lista di film, il proprio status e
// il proprio eventuale errore, esattamente come prima ma per tutti e 10
// i generi, senza duplicare codice per ciascuno.
interface FilmsState {
  byGenere: Record<Genere, FilmSummary[]>;
  statusByGenere: Record<Genere, RequestStatus>;
  errorByGenere: Record<Genere, string | null>;
}

function buildInitialRecord<T>(value: T): Record<Genere, T> {
  return GENERI.reduce((acc, genere) => {
    acc[genere] = value;
    return acc;
  }, {} as Record<Genere, T>);
}

const initialState: FilmsState = {
  byGenere: buildInitialRecord<FilmSummary[]>([]),
  statusByGenere: buildInitialRecord<RequestStatus>("idle"),
  errorByGenere: buildInitialRecord<string | null>(null),
};

export const fetchFilmsByGenere = createAsyncThunk<
  { genere: Genere; data: FilmSummary[] },
  Genere,
  { rejectValue: { genere: Genere; message: string } }
>("films/fetchByGenere", async (genere, { rejectWithValue }) => {
  try {
    const data = await getFilmsByGenere(genere);
    return { genere, data };
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
