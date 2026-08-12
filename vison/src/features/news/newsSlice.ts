import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllNews } from "../../firebase/newsApi";
import type { NewsArticle, RequestStatus } from "../../types/cinema.types";
interface NewsState {
  items: NewsArticle[];
  status: RequestStatus;
  error: string | null;
}
const initialState: NewsState = { items: [], status: "idle", error: null };
export const fetchNews = createAsyncThunk<
  NewsArticle[],
  void,
  { rejectValue: string }
>("news/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getAllNews();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Errore	sconosciuto",
    );
  }
});
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchNews.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Errore";
      });
  },
});
export default newsSlice.reducer;
