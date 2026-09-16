import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import GameRow from "@/components/GameRow";
import YearPicker from "@/components/YearPicker";
import AddGameForm from "@/components/AddGameForm";
import { getGames, getYears } from "@/lib/notion";
import { getOptions } from "@/lib/writes";

// ISR: cada ano é uma página cacheada, revalidada a cada 5 min — a lista
// responde quase instantâneo e ainda pega o que você editar no Notion.
// Toda escrita chama revalidatePath, então o que você muda no painel aparece na hora.
export const revalidate = 300;

// os anos que já existem no Notion viram páginas estáticas no build;
// um ano novo (2027, digamos) é renderizado na primeira visita e fica cacheado.
export async function generateStaticParams() {
  const years = await getYears("jogos");
  return years.map((ano) => ({ ano: String(ano) }));
}

export async function generateMetadata({ params }) {
  const { ano } = await params;
  return { title: `Jogos ${ano}` };
}

export default async function JogosDoAno({ params }) {
  const { ano } = await params;
  const [games, years, options] = await Promise.all([
    getGames(ano),
    getYears("jogos"),
    getOptions("jogos", ano),
  ]);

  if (!games) notFound();

  const playing = games.filter((game) => !game.done);
  const finished = games.filter((game) => game.done);

  return (
    <div className="mx-auto flex h-[calc(100dvh-2rem)] w-fit flex-col">
      <SectionHeader
        title="Jogos"
        subtitle={`${games.length} em ${ano} · ${finished.length} zerados`}
        tone="orange"
      >
        <YearPicker section="jogos" years={years} current={ano} />
      </SectionHeader>

      <AddGameForm ano={ano} genres={options.genres} existing={games.map((game) => game.name)} />

      <MediaList
        empty={`Nenhum jogo cadastrado em ${ano}.`}
        note="lido do Notion · revalida a cada 5 min"
      >
        {playing.map((game) => (
          <GameRow key={game.id} game={game} ano={ano} ratings={options.ratings} genres={options.genres} />
        ))}
        {finished.length > 0 ? (
          <GroupLabel>✔ zerados ({finished.length})</GroupLabel>
        ) : null}
        {finished.map((game) => (
          <GameRow key={game.id} game={game} ano={ano} ratings={options.ratings} genres={options.genres} />
        ))}
      </MediaList>
    </div>
  );
}
