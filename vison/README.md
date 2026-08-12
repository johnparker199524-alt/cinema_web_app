# Cinema Web App

App React + TypeScript + Redux Toolkit per catalogo film, calendario uscite
e news di cinema.

## Fonte dati

Architettura ibrida:

- **Film e calendario uscite** → [TMDB](https://www.themoviedb.org/) (The
  Movie Database), API pubblica e gratuita. Vedi `src/tmdb/`.
- **News** → Firebase Realtime Database (nodo `/news`, sola lettura). Vedi
  `src/firebase/`. TMDB non ha un equivalente editoriale per le news di
  cinema, quindi questa sezione resta invariata rispetto alla versione
  precedente.

### Configurazione TMDB

1. Registrati su https://www.themoviedb.org/ (gratuito).
2. Vai su https://www.themoviedb.org/settings/api e richiedi una API key.
3. Copia `.env.example` in `.env` e imposta **una** delle due:
   - `VITE_TMDB_API_KEY` (API Key v3), oppure
   - `VITE_TMDB_ACCESS_TOKEN` (Read Access Token v4).

### Configurazione Firebase (solo News)

1. Imposta le variabili `VITE_FIREBASE_*` in `.env` con i dati del tuo
   progetto Firebase.
2. Applica le regole in `firebase-data/database.rules.json` (sola lettura,
   solo nodo `/news`).
3. Importa `firebase-data/seed-news-only.json` nel Realtime Database
   (Console Firebase → Realtime Database → ⋮ → Importa JSON).

### Mappatura generi

I 10 generi dell'app (`src/types/cinema.types.ts`) sono mappati 1:1 sugli
id genere "movie" di TMDB in `src/tmdb/genereMap.ts`.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
