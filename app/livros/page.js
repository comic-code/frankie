import SectionHeader from "@/components/SectionHeader";
import MediaList from "@/components/MediaList";
import BookRow from "@/components/BookRow";
import { getBooks } from "@/lib/notion";

export const revalidate = 300;

export const metadata = { title: "Livros" };

export default async function LivrosPage() {
  const books = await getBooks();
  const doneCount = books.filter((book) => book.done).length;

  return (
    <div className="mx-auto w-fit">
      <SectionHeader
        title="Livros"
        subtitle={`${books.length} livros · ${doneCount} lidos`}
        tone="green"
      />
      <MediaList
        empty="Nenhum livro na lista."
        note="lido do Notion · revalida a cada 5 min"
      >
        {books.map((book) => (
          <BookRow key={book.id} book={book} />
        ))}
      </MediaList>
    </div>
  );
}
