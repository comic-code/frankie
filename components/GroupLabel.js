// Divisor entre "em andamento" e "zerados/lidos" — sem ele, o que já foi
// concluído fica empurrado pro fim da lista e some da vista.
export default function GroupLabel({ children }) {
  return (
    <li className="anim-fade pt-5 pb-2 text-xs tracking-[0.2em] text-fg/40 uppercase">
      {children}
    </li>
  );
}
