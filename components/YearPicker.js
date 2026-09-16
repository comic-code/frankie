import Link from "next/link";

// Seletor de ano: só links, sem estado no cliente — cada ano é uma página
// cacheada. `section` é o slug da rota ("jogos" / "livros").
export default function YearPicker({ section, years, current }) {
  if (years.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-[0.65rem] tracking-[0.2em] text-white/60 uppercase">ano</span>
      {years.map((year) => {
        const active = Number(year) === Number(current);
        return (
          <Link
            key={year}
            href={`/${section}/${year}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-2 py-0.5 text-xs transition ${
              active
                ? "bg-bg font-bold text-fg"
                : "bg-black/20 text-white/75 hover:bg-black/40 hover:text-white"
            }`}
          >
            {year}
          </Link>
        );
      })}
    </div>
  );
}
