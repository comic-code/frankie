import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import GroupLabel from "@/components/GroupLabel";
import BookRow from "@/components/BookRow";
import { getBooks } from "@/lib/notion";

export const revalidate = 300;

export const metadata = { title: "Livros" };

export default async function LivrosPage() {
  const books = await getBooks();
  const reading = books.filter((book) => !book.done);
  const read = books.filter((book) => book.done);

  return (
    <div className="mx-auto w-fit">
      <SectionHeader
        title="Livros"
        subtitle={`${books.length} livros · ${read.length} lidos`}
        tone="green"
      />
      <MediaList
        empty="Nenhum livro na lista."
        note="lido do Notion · revalida a cada 5 min"
      >
        {reading.map((book) => (
          <BookRow key={book.id} book={book} />
        ))}
        {read.length > 0 ? <GroupLabel>✔ lidos ({read.length})</GroupLabel> : null}
        {read.map((book) => (
          <BookRow key={book.id} book={book} />
        ))}
      </MediaList>
    </div>
  );
}
