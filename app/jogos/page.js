import { redirect } from "next/navigation";
import { getYears } from "@/lib/notion";

// /jogos abre no ano mais recente que existir no Notion.
export const revalidate = 300;

export default async function JogosIndex() {
  const [latest] = await getYears("jogos");
  if (!latest) {
    return (
      <div className="mx-auto mt-24 w-[40rem] max-w-full rounded-lg border-2 border-orange bg-bg-alt p-6">
        <h1 className="text-xl font-bold text-orange">Nenhuma tabela de jogos encontrada</h1>
        <p className="mt-2 text-sm text-fg/70">
          Crie uma tabela chamada, por exemplo, <code>2027 - Jogos</code> no Notion e
          compartilhe com a integração. Ela aparece aqui sozinha.
        </p>
      </div>
    );
  }
  redirect(`/jogos/${latest}`);
}
