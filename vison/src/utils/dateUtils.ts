// Piccola utility di date "pure JS" pensata per riprodurre 1:1 i calcoli
// che prima venivano fatti in Java con java.time.LocalDate dentro
// CalendarioServiceImpl. Lavora sempre in formato ISO "YYYY-MM-DD"
// (stesso formato di f.dataUscita nel Realtime Database), cosi' il
// confronto tra date puo' avvenire anche come semplice confronto tra
// stringhe (lessicograficamente equivalente a un confronto cronologico
// quando il formato e' fisso YYYY-MM-DD).

// Data "oggi" a mezzanotte locale, senza componente oraria: equivalente
// di LocalDate.now() in Java (che non ha ore/minuti/secondi).
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

export function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

// Lunedi' della settimana di riferimento (WeekFields.of(DayOfWeek.MONDAY, 4)
// lato Java): getDay() restituisce 0=domenica..6=sabato, quindi si calcola
// quanti giorni sottrarre per arrivare al lunedi' della stessa settimana.
export function mondayOfWeek(d: Date): Date {
  const day = d.getDay(); // 0 (dom) - 6 (sab)
  const diff = day === 0 ? -6 : 1 - day; // se domenica, il lunedi' e' 6 giorni prima
  return addDays(d, diff);
}

// Confronto "BETWEEN" inclusivo su due date ISO, identico a
// findByDataUscitaBetweenOrderByDataUscitaAsc(inizio, fine).
export function isBetweenInclusive(dateISO: string, startISO: string, endISO: string): boolean {
  return dateISO >= startISO && dateISO <= endISO;
}
