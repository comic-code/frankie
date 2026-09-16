// A "ListWrapper" antiga: coluna de 40rem, fundo translúcido, scroll próprio.
export default function MediaList({ children, empty = "Nada por aqui ainda.", note }) {
  const isEmpty = Array.isArray(children) ? children.length === 0 : !children;

  return (
    <section className="w-[40rem] max-w-full">
      <ul className="anim-forward-left max-h-[75vh] overflow-y-auto bg-black/20 p-4">
        {isEmpty ? <li className="py-6 text-center text-fg/50">{empty}</li> : children}
      </ul>
      {note ? <p className="pt-2 text-xs text-fg/40">{note}</p> : null}
    </section>
  );
}
