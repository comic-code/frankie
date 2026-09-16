import Poster from "./Poster";
import GenreTag from "./GenreTag";
import { AchievementsToggle, DoneToggle, RatingForm, TextEditor } from "./RowActions";
import { formatDate } from "@/lib/format";

/**
 * @param {{ game: import("@/lib/notion").Game, ano: string|number, ratings: string[] }} props
 */
export default function GameRow({ game, ano, ratings }) {
  const {
    id,
    name,
    poster,
    release,
    done,
    doneDate,
    doneAchievements,
    notes,
    rating,
    genres,
  } = game;

  return (
    <li className="flex gap-4 border-b-2 border-orange-alt py-2 pb-4 transition-colors last:border-b-0 hover:bg-[#343434]">
      <Poster src={poster} alt={`Capa de ${name}`} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg leading-tight font-bold">{name}</h2>
          <RatingForm section="jogos" ano={ano} id={id} rating={rating} ratings={ratings} />
        </div>

        {genres.length > 0 ? (
          <div className="anim-fade mt-2 flex flex-wrap gap-1">
            {genres.map((genre) => (
              <GenreTag key={genre.name} name={genre.name} color={genre.color} />
            ))}
          </div>
        ) : null}

        {notes ? <p className="mt-2 text-sm text-fg/60">{notes}</p> : null}

        <TextEditor
          section="jogos"
          ano={ano}
          id={id}
          value={notes}
          label="notas"
        />

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs">
          {release ? (
            <span className="font-bold text-pink" title="Lançamento">
              {formatDate(release)}
            </span>
          ) : null}
          <DoneToggle
            section="jogos"
            ano={ano}
            id={id}
            done={done}
            date={formatDate(doneDate)}
            label="zerado"
          />
          <AchievementsToggle ano={ano} id={id} done={doneAchievements} />
        </div>
      </div>
    </li>
  );
}
