import Home from './pages/Home'
import Trama from './pages/Trama'
import CalendarioUscite from './pages/CalendarioUscite'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import NotFound from './pages/NotFound'
import Layout from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'

//import './App.css'

// Layout avvolge tutte le rotte e monta il Footer ovunque, ma la Navbar
// (Home | Calendario Uscite | News) viene mostrata SOLO nella Home
// (vedi Layout.tsx, che controlla il path corrente con useLocation).
// La ricerca "live"/dinamica resta invece SOLO nella Home
// (Home.tsx -> <SearchBar/>), esattamente come richiesto: nessuna altra
// pagina mostra il campo di ricerca.
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trama/:id" element={<Trama />} />
        <Route path="/calendario" element={<CalendarioUscite />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
