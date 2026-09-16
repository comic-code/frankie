import { createGameAction } from "@/app/actions";

// Formulário de criação. Tudo funciona sem JavaScript (form + server action) e
// a capa é sempre URL externa — arquivo enviado pro Notion expiraria em ~1h.
export default function AddGameForm({ ano, genres }) {
  return (
    <details className="w-[40rem] max-w-full bg-black/20 px-4">
      <summary className="cursor-pointer py-2 text-sm text-fg/50 transition hover:text-fg">
        ＋ adicionar jogo
      </summary>

      <form action={createGameAction} className="flex flex-col gap-2 pt-1 pb-3">
        <input type="hidden" name="ano" value={ano} />

        <input
          name="name"
          required
          placeholder="nome do jogo"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />
        <input
          name="poster"
          placeholder="URL da capa (IGDB, Amazon...)"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />
        <label className="flex items-center gap-2 text-xs text-fg/50">
          lançamento
          <input
            name="release"
            type="date"
            className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm text-fg"
          />
        </label>

        <fieldset className="flex flex-wrap gap-1">
          <legend className="mb-1 text-xs text-fg/50">gêneros</legend>
          {genres.map((genre) => (
            <label
              key={genre.name}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-fg/20 px-2 py-0.5 text-xs transition hover:border-fg/50"
            >
              <input type="checkbox" name="genres" value={genre.name} />
              {genre.name}
            </label>
          ))}
        </fieldset>

        <textarea
          name="notes"
          rows={2}
          placeholder="notas (opcional)"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />

        <button
          type="submit"
          className="self-start rounded-lg border-2 border-bg bg-green px-3 py-1 text-sm font-bold text-white transition hover:brightness-110"
        >
          salvar jogo
        </button>
      </form>
    </details>
  );
}
