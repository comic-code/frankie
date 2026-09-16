"use client";

import { useState, useTransition } from "react";
import Poster from "./Poster";
import GenreTag from "./GenreTag";
import { formatDate } from "@/lib/format";
import { updateBookAction } from "@/app/actions";

const input = "rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-sm text-fg";
const chip =
  "flex cursor-pointer items-center gap-1 rounded-full border border-fg/20 px-2 py-0.5 text-xs transition hover:border-fg/50";
const short = (value) => value.replace(" / 5.0 ⭐️", "");

/**
 * Linha de livro — mesma regra do jogo: no modo leitura só existe `editar`;
 * lido, nota, gêneros e citação mudam dentro da edição. `editable=false`
 * (anos anteriores) deixa a linha só de visualização.
 *
 * @param {{ book: import("@/lib/notion").Book, ano: string|number, ratings: string[], genres: {name: string}[], editable?: boolean }} props
 */
export default function BookRow({ book, ano, ratings, genres: genreOptions, editable = true }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const { id, name, author, quote, poster, done, doneDate, rating, genres } = book;

  const save = (formData) => {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookAction(formData);
        setEditing(false);
      } catch (e) {
        setError(e.message ?? "não deu pra salvar");
      }
    });
  };

  return (
    <li className="flex gap-4 border-b-2 border-orange-alt py-2 pb-4 transition-colors last:border-b-0 hover:bg-[#343434]">
      <Poster src={poster} alt={`Capa de ${name}`} />

      <div className="flex min-w-0 flex-1 flex-col">
        {editing ? (
          <form action={save} className="flex flex-col gap-2">
            <input type="hidden" name="ano" value={ano} />
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="doneBefore" value={done ? "1" : "0"} />

            <input name="name" defaultValue={name} required className={input} />
            <input name="author" defaultValue={author} placeholder="autor" className={input} />

            <label className="flex items-center gap-1 text-xs text-fg/50">
              nota
              <select
                name="rating"
                defaultValue={rating ?? ""}
                className="rounded-lg border-2 border-bg bg-black/30 px-2 py-1 text-xs text-green"
              >
                <option value="">—</option>
                {ratings.map((value) => (
                  <option key={value} value={value}>
                    {short(value)}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="flex flex-wrap gap-1">
              <legend className="mb-1 text-xs text-fg/50">gêneros</legend>
              {genreOptions.map((option) => (
                <label key={option.name} className={chip}>
                  <input
                    type="checkbox"
                    name="genres"
                    value={option.name}
                    defaultChecked={genres.some((genre) => genre.name === option.name)}
                  />
                  {option.name}
                </label>
              ))}
            </fieldset>

            <textarea
              name="quote"
              rows={3}
              defaultValue={quote}
              placeholder="citação"
              className={input}
            />

            <label className="flex w-fit cursor-pointer items-center gap-2 pt-1 text-xs text-fg/70">
              <input
                type="checkbox"
                name="done"
                defaultChecked={done}
                className="size-4 accent-green"
              />
              lido
              {doneDate ? <span className="text-fg/40">({formatDate(doneDate)})</span> : null}
            </label>

            {error ? <p className="text-xs text-orange">{error}</p> : null}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg border-2 border-bg bg-green px-3 py-1 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {pending ? "salvando…" : "salvar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-lg border-2 border-fg/20 px-3 py-1 text-xs text-fg/70 transition hover:text-fg"
              >
                cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg leading-tight font-bold">
                {name}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                {rating ? (
                  <span className="rounded-full border border-green px-2 py-0.5 text-xs text-green">
                    {rating}
                  </span>
                ) : null}
                {editable ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 rounded-lg bg-orange-alt px-2.5 py-1 text-xs font-bold text-white transition hover:bg-white hover:text-orange-alt"
                  >
                    ✎ editar
                  </button>
                ) : null}
              </div>
            </div>
            {author ? (
                <h3 className="text-sm font-normal text-fg/50">{author}</h3>
                ) : null}

            {genres.length > 0 ? (
              <div className="anim-fade mt-2 flex flex-wrap gap-1">
                {genres.map((genre) => (
                  <GenreTag key={genre.name} name={genre.name} color={genre.color} />
                ))}
              </div>
            ) : null}

            {quote ? (
              <p className="mt-2 border-l-2 border-yellow/40 pl-2 text-sm text-yellow-alt/80 italic">
                “{quote}”
              </p>
            ) : null}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs">
              {done ? (
                <span className="rounded-full border border-green-alt/50 px-2 py-0.5 text-green-alt">
                  ✔ lido{doneDate ? ` ${formatDate(doneDate)}` : ""}
                </span>
              ) : null}
            </div>
          </>
        )}
      </div>
    </li>
  );
}
