import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import GameRow from "@/components/GameRow";
import { getGames } from "@/lib/notion";

// ISR: a página é cacheada e revalidada a cada 5 min — a lista responde quase
// instantâneo e ainda assim pega o que você editar no Notion pelo celular.
export const revalidate = 300;

export const metadata = { title: "Jogos" };

export default async function JogosPage() {
  const games = await getGames();
  const playing = games.filter((game) => !game.done);
  const finished = games.filter((game) => game.done);

  return (
    <div className="mx-auto w-fit">
      <SectionHeader
        title="Jogos"
        subtitle={`${games.length} jogos · ${finished.length} zerados`}
        tone="orange"
      />
      <MediaList
        empty="Nenhum jogo na lista."
        note="lido do Notion · revalida a cada 5 min"
      >
        {playing.map((game) => (
          <GameRow key={game.id} game={game} />
        ))}
        {finished.length > 0 ? (
          <GroupLabel>✔ zerados ({finished.length})</GroupLabel>
        ) : null}
        {finished.map((game) => (
          <GameRow key={game.id} game={game} />
        ))}
      </MediaList>
    </div>
  );
}
