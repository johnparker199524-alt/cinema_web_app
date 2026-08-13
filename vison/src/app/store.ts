import { configureStore } from "@reduxjs/toolkit";
import filmsReducer from "../features/films/filmsSlice";
import filmDetailReducer from "../features/films/filmDetailSlice";
import calendarioReducer from "../features/calendario/calendarioSlice";
import newsReducer from "../features/news/newsSlice";
import newsDetailReducer from "../features/news/newsDetailSlice";
import filmsSearchReducer from "../features/films/filmsSearchSlice";
export const store = configureStore({
  reducer: {
    films: filmsReducer,
    filmsSearch: filmsSearchReducer,
    filmDetail: filmDetailReducer,
    calendario: calendarioReducer,
    news: newsReducer,
    newsDetail: newsDetailReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
