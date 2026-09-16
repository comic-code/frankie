import { redirect } from "next/navigation";
import { getYears } from "@/lib/notion";

// /livros abre no ano mais recente que existir no Notion.
export const revalidate = 300;

export default async function LivrosIndex() {
  const [latest] = await getYears("livros");
  if (!latest) {
    return (
      <div className="mx-auto mt-24 w-[40rem] max-w-full rounded-lg border-2 border-green bg-bg-alt p-6">
        <h1 className="text-xl font-bold text-green">Nenhuma tabela de livros encontrada</h1>
        <p className="mt-2 text-sm text-fg/70">
          Crie uma tabela chamada, por exemplo, <code>2027 - Livros</code> no Notion e
          compartilhe com a integração. Ela aparece aqui sozinha.
        </p>
      </div>
    );
  }
  redirect(`/livros/${latest}`);
}
