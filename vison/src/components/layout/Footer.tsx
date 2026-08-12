// Riproduce il footer "2024 Cinemawebapp Srl" mostrato in fondo alle
// slide del mockup (es. schermate Home/Drammatico e Home/Sentimentale).
export default function Footer(): JSX.Element {
  return (
    <footer className="footer-cinema text-center py-3 mt-5">
      <small>&copy; {new Date().getFullYear()} Cinemawebapp Srl</small>
    </footer>
  );
}
