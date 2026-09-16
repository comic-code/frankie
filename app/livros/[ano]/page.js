import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import BookRow from "@/components/BookRow";
import YearPicker from "@/components/YearPicker";
import AddBookForm from "@/components/AddBookForm";
import { getBooks, getYears } from "@/lib/notion";
import { getOptions } from "@/lib/writes";

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
  const [books, years, options] = await Promise.all([
    getBooks(ano),
    getYears("livros"),
    getOptions("livros", ano),
  ]);

  if (!books) notFound();

  const reading = books.filter((book) => !book.done);
  const read = books.filter((book) => book.done);

  return (
    <div className="mx-auto flex h-[calc(100dvh-2rem)] w-fit flex-col">
      <SectionHeader
        title="Livros"
        subtitle={`${books.length} em ${ano} · ${read.length} lidos`}
        tone="green"
      >
        <YearPicker section="livros" years={years} current={ano} />
      </SectionHeader>

      <AddBookForm ano={ano} genres={options.genres} />

      <MediaList
        empty={`Nenhum livro cadastrado em ${ano}.`}
        note="lido do Notion · revalida a cada 5 min"
      >
        {reading.map((book) => (
          <BookRow key={book.id} book={book} ano={ano} ratings={options.ratings} />
        ))}
        {read.length > 0 ? <GroupLabel>✔ lidos ({read.length})</GroupLabel> : null}
        {read.map((book) => (
          <BookRow key={book.id} book={book} ano={ano} ratings={options.ratings} />
        ))}
      </MediaList>
    </div>
  );
}
