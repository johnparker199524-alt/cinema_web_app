import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchFilms as searchFilmsApi } from "../../tmdb/filmsApi";
import type { FilmSummary, RequestStatus } from "../../types/cinema.types";
interface FilmsSearchState {
  results: FilmSummary[];
  status: RequestStatus;
  error: string | null;
  query: string;
}
const initialState: FilmsSearchState = {
  results: [],
  status: "idle",
  error: null,
  query: "",
};

export const searchFilms = createAsyncThunk<
  FilmSummary[],
  string,
  { rejectValue: string }
>("filmsSearch/search", async (query, { rejectWithValue }) => {
  try {
    return await searchFilmsApi(query);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Errore	sconosciuto",
    );
  }
});
const filmsSearchSlice = createSlice({
  name: "filmsSearch",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFilms.pending, (s) => {
        s.status = "loading";
      })
      .addCase(searchFilms.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.results = a.payload;
      })
      .addCase(searchFilms.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Errore";
      });
  },
});
export const { setQuery, clearResults } = filmsSearchSlice.actions;
export default filmsSearchSlice.reducer;
