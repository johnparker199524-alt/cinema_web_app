import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNewsById } from "../../firebase/newsApi";
import type { NewsArticle, RequestStatus } from "../../types/cinema.types";
interface NewsDetailState {
  data: NewsArticle | null;
  status: RequestStatus;
  error: string | null;
}
const initialState: NewsDetailState = {
  data: null,
  status: "idle",
  error: null,
};
export const fetchNewsDetail = createAsyncThunk<
  NewsArticle,
  number,
  {
    rejectValue: string;
  }
>("newsDetail/fetch", async (id, { rejectWithValue }) => {
  try {
    return await getNewsById(id);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Errore	sconosciuto");
  }
});
const newsDetailSlice = createSlice({
  name: "newsDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsDetail.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchNewsDetail.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.data = a.payload;
      })
      .addCase(fetchNewsDetail.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Errore";
      });
  },
});
export default newsDetailSlice.reducer;
