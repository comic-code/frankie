"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createGameAction } from "@/app/actions";

const releaseYear = (iso) => (iso ? iso.slice(0, 4) : null);

// Única parte do painel que exige JavaScript: buscar no IGDB enquanto digita.
// O "adicionar" continua sendo um form + Server Action, então a escrita em si
// funciona igual ao resto. O termo pode vir da URL (?q=zelda), o que torna a
// busca linkável e recarregável.
export default function GameSearch({ ano, genres, existing }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const inFlight = useRef(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    // debounce: o IGDB leva ~2s por consulta, não vale disparar a cada letra
    const timer = setTimeout(async () => {
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;
      setStatus("loading");
      try {
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResults(data.results ?? []);
        setStatus("done");
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
          setStatus("error");
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  const known = new Set(existing.map((name) => name.toLowerCase()));

  return (
    <div className="flex flex-col gap-2 pb-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="buscar no IGDB (2+ letras)..."
        className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
      />

      {status === "loading" ? <p className="text-xs text-fg/40">consultando o IGDB…</p> : null}
      {status === "error" ? (
        <p className="text-xs text-orange">a busca falhou (IGDB fora do ar ou credencial do Twitch)</p>
      ) : null}
      {status === "done" && results.length === 0 ? (
        <p className="text-xs text-fg/40">nada encontrado.</p>
      ) : null}

      {results.map((game) => {
        const already = known.has(game.name.toLowerCase());
        // só manda gênero que existe como opção no Notion (senão a API recusa)
        const validGenres = game.genres.filter((genre) =>
          genres.some((option) => option.name === genre),
        );
        const subtitle = [releaseYear(game.release), game.platforms.join(", ")]
          .filter(Boolean)
          .join(" · ");

        return (
          <div key={game.igdbId} className="anim-fade flex items-center gap-3 rounded-lg bg-black/20 p-2">
            {game.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.poster}
                alt=""
                width={40}
                height={55}
                loading="lazy"
                className="h-[55px] w-10 shrink-0 rounded border border-bg object-cover"
              />
            ) : (
              <div className="h-[55px] w-10 shrink-0 rounded border border-bg bg-black/30" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {game.name}
                {game.typeLabel ? (
                  <span className="ml-2 rounded-full border border-yellow/40 px-1.5 py-0.5 text-[0.6rem] font-normal text-yellow">
                    {game.typeLabel}
                  </span>
                ) : null}
              </p>
              {subtitle ? <p className="truncate text-xs text-fg/50">{subtitle}</p> : null}
              {validGenres.length ? (
                <p className="truncate text-xs text-fg/40">{validGenres.join(" · ")}</p>
              ) : null}
            </div>

            <form action={createGameAction}>
              <input type="hidden" name="ano" value={ano} />
              <input type="hidden" name="name" value={game.name} />
              <input type="hidden" name="poster" value={game.poster ?? ""} />
              <input type="hidden" name="release" value={game.release ?? ""} />
              {validGenres.map((genre) => (
                <input key={genre} type="hidden" name="genres" value={genre} />
              ))}
              <button
                type="submit"
                disabled={already}
                title={already ? "já está na sua lista" : `adicionar ${game.name}`}
                className={`rounded-lg border-2 border-bg px-2 py-1 text-xs font-bold transition ${
                  already ? "bg-fg/10 text-fg/40" : "bg-green text-white hover:brightness-110"
                }`}
              >
                {already ? "na lista" : "adicionar"}
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
