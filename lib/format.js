// Datas do Notion chegam como "YYYY-MM-DD" (sem hora). Formatar direto da
// string evita o clássico bug de fuso: no server da Vercel o relógio é UTC, e
// `new Date("2024-01-15")` + toLocaleDateString mostraria 14/01.
export function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}
