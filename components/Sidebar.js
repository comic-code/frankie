"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mesma ideia da Nav antiga (faixa branca, borda laranja, emoji), mas com as
// seções que sobreviveram: jogos e livros. Guitar entra depois.
const LINKS = [
  { href: "/jogos", icon: "🎮", label: "Jogos" },
  { href: "/livros", icon: "📚", label: "Livros" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Seções"
      className="fixed top-4 left-0 z-50 flex w-20 flex-col gap-2 rounded-r-2xl border-2 border-l-0 border-orange-alt bg-fg p-2 shadow-[-1px_10px_7px_-7px_rgba(0,0,0,0.75)]"
    >
      {LINKS.map(({ href, icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-center border-l-2 border-orange-alt py-2 text-3xl transition ${
              active
                ? "opacity-100 drop-shadow-[1px_1px_1px_#000]"
                : "opacity-40 hover:opacity-100"
            }`}
          >
            {icon}
          </Link>
        );
      })}
    </nav>
  );
}
