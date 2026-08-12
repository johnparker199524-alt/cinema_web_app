// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.tsx'
// Import Bootstrap CSS e icone
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/theme.css'

// FIX: per default il browser ripristina da solo la vecchia posizione di
// scroll quando la pagina viene ricaricata (history.scrollRestoration
// è "auto"). Anche se il nostro stato React parte "pulito" al reload,
// il browser scorreva comunque fino a dov'eri prima, dando l'illusione
// che il film scelto fosse ancora "in primo piano" per sempre. Con
// "manual" disattiviamo questo comportamento nativo: ci pensa il nostro
// codice (vedi ScrollToTop.tsx) a decidere dove posizionare lo scroll.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual"
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)