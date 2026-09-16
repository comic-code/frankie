// A "ListWrapper" antiga: coluna de 40rem, fundo translúcido.
// O scroll fica SÓ na listagem: a coluna ocupa a altura da tela, o cabeçalho
// (e a nota) ficam parados e a <ul> rola por dentro. Assim a página não rola e
// o seletor de ano nunca sai de vista.
export default function MediaList({ children, empty = "Nada por aqui ainda.", note }) {
  const isEmpty = Array.isArray(children) ? children.length === 0 : !children;

  return (
    <section className="flex min-h-0 w-[40rem] max-w-full flex-col">
      <ul className="anim-forward-left min-h-0 overflow-y-auto rounded-b-lg bg-black/20 p-4">
        {isEmpty ? <li className="py-6 text-center text-fg/50">{empty}</li> : children}
      </ul>
      {note ? <p className="shrink-0 pt-2 text-xs text-fg/40">{note}</p> : null}
    </section>
  );
}
