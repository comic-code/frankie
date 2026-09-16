import Poster from "./Poster";
import GenreTag from "./GenreTag";
import DoneBadge from "./DoneBadge";
import { formatDate } from "@/lib/format";

/** @param {{ game: import("@/lib/notion").Game }} props */
export default function GameRow({ game }) {
  const {
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
          {rating ? (
            <span className="shrink-0 rounded-full border border-green px-2 py-0.5 text-xs text-green">
              {rating}
            </span>
          ) : null}
        </div>

        {genres.length > 0 ? (
          <div className="anim-fade mt-2 flex flex-wrap gap-1">
            {genres.map((genre) => (
              <GenreTag key={genre.name} name={genre.name} color={genre.color} />
            ))}
          </div>
        ) : null}

        {notes ? <p className="mt-2 text-sm text-fg/60">{notes}</p> : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs">
          {release ? (
            <span className="font-bold text-pink" title="Lançamento">
              {formatDate(release)}
            </span>
          ) : null}
          <DoneBadge done={done} date={formatDate(doneDate)} label="zerado" />
          {doneAchievements ? <span title="100% / platinado">🏆</span> : null}
        </div>
      </div>
    </li>
  );
}
