import { get, ref } from "firebase/database";
import { db } from "./config";
import type { NewsArticle } from "../types/cinema.types";

let newsCache: Promise<NewsArticle[]> | null = null;

// Stessa strategia di filmsApi.ts: un solo nodo /news (23 elementi), letto
// una volta e cachato, poi ordinato in memoria — equivalente della query
// findAllByOrderByDataPubblicazioneDesc() del NewsRepository Spring.
function loadAllNews(): Promise<NewsArticle[]> {
  if (!newsCache) {
    newsCache = get(ref(db, "news"))
      .then((snapshot) => {
        if (!snapshot.exists()) return [];
        const value = snapshot.val() as Record<string, NewsArticle>;
        return Object.values(value).sort((a, b) =>
          b.dataPubblicazione.localeCompare(a.dataPubblicazione),
        );
      })
      .catch((err) => {
        newsCache = null;
        throw err;
      });
  }
  return newsCache;
}

// GET /api/news
export async function getAllNews(): Promise<NewsArticle[]> {
  return loadAllNews();
}

// GET /api/news/ultime?limit=N -> findAllByOrderByDataPubblicazioneDesc().limit(N)
export async function getLatestNews(limit: number): Promise<NewsArticle[]> {
  const news = await loadAllNews();
  return news.slice(0, limit);
}

// GET /api/news/{id} -> findById(id).orElseThrow(ResourceNotFoundException)
export async function getNewsById(id: number): Promise<NewsArticle> {
  const news = await loadAllNews();
  const article = news.find((n) => n.id === id);
  if (!article) {
    throw new Error(`News con id ${id} non trovata`);
  }
  return article;
}
