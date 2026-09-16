// Marcador de "zerado" / "lido" + data. Sem interação ainda (escrita entra na F2).
export default function DoneBadge({ done, date, label }) {
  if (!done) return null;

  return (
    <span className="rounded-full border border-green-alt/50 px-2 py-0.5 text-green-alt">
      ✔ {date ? `${label} ${date}` : label}
    </span>
  );
}
