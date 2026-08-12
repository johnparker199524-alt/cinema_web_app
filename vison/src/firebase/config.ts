import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// NOTA: da quando il catalogo film e il calendario uscite leggono da TMDB
// (vedi src/tmdb/), Firebase viene usato SOLO per la sezione News (nodo
// /news, vedi firebase-data/seed-news-only.json e firebase-data/database.rules.json).
//
// Tutte le chiavi vengono da variabili VITE_* (vedi .env.example): sono
// valori PUBBLICI per design (Firebase le espone comunque a chiunque apra i
// DevTools del browser, dato che il client deve conoscerle per parlare col
// progetto). La sicurezza reale non sta nel nasconderle, ma nelle Realtime
// Database Rules configurate sulla console Firebase (vedi firebase-data/database.rules.json):
// questa app usa il database in SOLA LETTURA dal client (".write": false),
// quindi anche se qualcuno copia queste chiavi non puo' modificare i dati.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Un solo bean/istanza per tutta l'app (equivalente del @Bean Spring che
// creava un unico DataSource condiviso): initializeApp/getDatabase vengono
// chiamate una volta sola qui, e questa istanza di "db" viene importata
// da tutti i moduli in src/firebase/*.
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
