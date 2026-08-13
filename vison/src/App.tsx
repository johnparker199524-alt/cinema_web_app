import Home from "./pages/Home";
import Trama from "./pages/Trama";
import CalendarioUscite from "./pages/CalendarioUscite";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
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
  );
}
export default App;
