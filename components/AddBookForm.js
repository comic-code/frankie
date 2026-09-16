import { createBookAction } from "@/app/actions";

export default function AddBookForm({ ano, genres }) {
  return (
    <details className="w-[40rem] max-w-full bg-black/20 px-4">
      <summary className="cursor-pointer py-2 text-sm text-fg/50 transition hover:text-fg">
        ＋ adicionar livro
      </summary>

      <form action={createBookAction} className="flex flex-col gap-2 pt-1 pb-3">
        <input type="hidden" name="ano" value={ano} />

        <input
          name="name"
          required
          placeholder="título"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />
        <input
          name="author"
          placeholder="autor"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />
        <input
          name="poster"
          placeholder="URL da capa (Amazon...)"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />

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
          name="quote"
          rows={2}
          placeholder="citação (opcional)"
          className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm"
        />

        <button
          type="submit"
          className="self-start rounded-lg border-2 border-bg bg-green px-3 py-1 text-sm font-bold text-white transition hover:brightness-110"
        >
          salvar livro
        </button>
      </form>
    </details>
  );
}
