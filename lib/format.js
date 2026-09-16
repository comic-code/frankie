// Datas do Notion chegam como "YYYY-MM-DD" (sem hora). Formatar direto da
// string evita o clássico bug de fuso: no server da Vercel o relógio é UTC, e
// `new Date("2024-01-15")` + toLocaleDateString mostraria 14/01.
export function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

// Tudo que é "hoje" passa por aqui: no server da Vercel o relógio é UTC, e um
// "zerado hoje" às 22h de Brasília seria gravado como o dia seguinte.
export const TIMEZONE = "America/Sao_Paulo";

/** data de hoje (YYYY-MM-DD) no fuso do usuário */
export function today() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: TIMEZONE }).format(new Date());
}

/** ano corrente no fuso do usuário — é o único ano que aceita escrita */
export function currentYear() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric" }).format(
    new Date(),
  );
}

