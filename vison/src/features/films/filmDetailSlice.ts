import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFilmById } from "../../tmdb/filmsApi";
import type { FilmDetail, RequestStatus } from "../../types/cinema.types";
interface FilmDetailState {
  data: FilmDetail | null;
  status: RequestStatus;
  error: string | null;
}
const initialState: FilmDetailState = {
  data: null,
  status: "idle",
  error: null,
};
export const fetchFilmDetail = createAsyncThunk<
  FilmDetail,
  number,
  {
    rejectValue: string;
  }
>("filmDetail/fetch", async (id, { rejectWithValue }) => {
  try {
    return await getFilmById(id);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Errore	sconosciuto");
  }
});
const filmDetailSlice = createSlice({
  name: "filmDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilmDetail.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchFilmDetail.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.data = a.payload;
      })
      .addCase(fetchFilmDetail.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Errore";
      });
  },
});
export default filmDetailSlice.reducer;
