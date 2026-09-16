import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import GameRow from "@/components/GameRow";
import YearPicker from "@/components/YearPicker";
import AddGameForm from "@/components/AddGameForm";
import { getGames, getYears } from "@/lib/notion";
import { getOptions } from "@/lib/writes";
import { currentYear } from "@/lib/format";

// ISR: cada ano é uma página cacheada, revalidada a cada 5 min — a lista
// responde quase instantâneo e ainda reflete edições feitas direto no Notion.
// Toda escrita chama revalidatePath, então alterações pelo painel aparecem na hora.
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
  const [games, years] = await Promise.all([getGames(ano), getYears("jogos")]);
  if (!games) notFound();

  // só o ano corrente aceita escrita; os anteriores são arquivo. A regra é
  // reforçada no servidor (assertEditable nas actions) — aqui é só a interface.
  const editable = String(ano) === String(currentYear());
  const options = editable ? await getOptions("jogos", ano) : { ratings: [], genres: [] };

  const playing = games.filter((game) => !game.done);
  const finished = games.filter((game) => game.done);

  return (
    <div className="mx-auto flex h-[calc(100dvh-2rem)] w-fit flex-col">
      <SectionHeader
        title="Jogos"
        subtitle={`${games.length} em ${ano} · ${finished.length} zerados${editable ? "" : " · só leitura"}`}
        tone="orange"
      >
        <YearPicker section="jogos" years={years} current={ano} />
      </SectionHeader>

      {editable ? (
        <AddGameForm
          ano={ano}
          genres={options.genres}
          existing={games.map((game) => game.name)}
        />
      ) : (
        <p className="w-[40rem] max-w-full bg-black/20 px-4 py-2 text-xs text-fg/40">
          ano arquivado — apenas visualização.
        </p>
      )}

      <MediaList
        empty={`Nenhum jogo cadastrado em ${ano}.`}
        note="lido do Notion · revalida a cada 5 min"
      >
        {playing.map((game) => (
          <GameRow key={game.id} game={game} ano={ano} ratings={options.ratings} genres={options.genres} editable={editable} />
        ))}
        {finished.length > 0 ? (
          <GroupLabel>✔ zerados ({finished.length})</GroupLabel>
        ) : null}
        {finished.map((game) => (
          <GameRow key={game.id} game={game} ano={ano} ratings={options.ratings} genres={options.genres} editable={editable} />
        ))}
      </MediaList>
    </div>
  );
}
