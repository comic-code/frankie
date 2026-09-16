import Poster from "./Poster";
import GenreTag from "./GenreTag";
import { DoneToggle, RatingForm, TextEditor } from "./RowActions";
import { formatDate } from "@/lib/format";

/**
 * @param {{ book: import("@/lib/notion").Book, ano: string|number, ratings: string[] }} props
 */
export default function BookRow({ book, ano, ratings }) {
  const { id, name, author, quote, poster, done, doneDate, rating, genres } = book;

  return (
    <li className="flex gap-4 border-b-2 border-orange-alt py-2 pb-4 transition-colors last:border-b-0 hover:bg-[#343434]">
      <Poster src={poster} alt={`Capa de ${name}`} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg leading-tight font-bold">
            {name}
            {author ? <span className="ml-2 text-sm font-normal text-fg/60">{author}</span> : null}
          </h2>
          <RatingForm section="livros" ano={ano} id={id} rating={rating} ratings={ratings} />
        </div>

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

        <TextEditor section="livros" ano={ano} id={id} value={quote} label="citação" />

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs">
          <DoneToggle
            section="livros"
            ano={ano}
            id={id}
            done={done}
            date={formatDate(doneDate)}
            label="lido"
          />
        </div>
      </div>
    </li>
  );
}
