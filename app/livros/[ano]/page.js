import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import BookRow from "@/components/BookRow";
import YearPicker from "@/components/YearPicker";
import AddBookForm from "@/components/AddBookForm";
import { getBooks, getYears } from "@/lib/notion";
import { getOptions } from "@/lib/writes";
import { currentYear } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  const years = await getYears("livros");
  return years.map((ano) => ({ ano: String(ano) }));
}

export async function generateMetadata({ params }) {
  const { ano } = await params;
  return { title: `Livros ${ano}` };
}

export default async function LivrosDoAno({ params }) {
  const { ano } = await params;
  const [books, years] = await Promise.all([getBooks(ano), getYears("livros")]);
  if (!books) notFound();

  // só o ano corrente aceita escrita (reforçado no servidor pelas actions)
  const editable = String(ano) === String(currentYear());
  const options = editable ? await getOptions("livros", ano) : { ratings: [], genres: [] };

  const reading = books.filter((book) => !book.done);
  const read = books.filter((book) => book.done);

  return (
    <div className="mx-auto flex h-[calc(100dvh-2rem)] w-fit flex-col">
      <SectionHeader
        title="Livros"
        subtitle={`${books.length} em ${ano} · ${read.length} lidos${editable ? "" : " · só leitura"}`}
        tone="green"
      >
        <YearPicker section="livros" years={years} current={ano} />
      </SectionHeader>

      {editable ? (
        <AddBookForm
          ano={ano}
          genres={options.genres}
        />
      ) : (
        <p className="w-[40rem] max-w-full bg-black/20 px-4 py-2 text-xs text-fg/40">
          ano arquivado — apenas visualização.
        </p>
      )}

      <MediaList
        empty={`Nenhum livro cadastrado em ${ano}.`}
        note="lido do Notion · revalida a cada 5 min"
      >
        {reading.map((book) => (
          <BookRow key={book.id} book={book} ano={ano} ratings={options.ratings} genres={options.genres} editable={editable} />
        ))}
        {read.length > 0 ? <GroupLabel>✔ lidos ({read.length})</GroupLabel> : null}
        {read.map((book) => (
          <BookRow key={book.id} book={book} ano={ano} ratings={options.ratings} genres={options.genres} editable={editable} />
        ))}
      </MediaList>
    </div>
  );
}
