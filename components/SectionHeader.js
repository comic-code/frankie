// Barra colorida no topo da lista (o ListHeader antigo): fundo na cor da seção,
// título branco com borda interna no tom do fundo. `children` entra embaixo —
// é onde o seletor de ano mora.
export default function SectionHeader({ title, subtitle, tone = "orange", children }) {
  const background = tone === "green" ? "bg-green-2" : "bg-orange-alt";

  return (
    <header className={`anim-forward-left w-[40rem] max-w-full shrink-0 rounded-t-lg p-4 ${background}`}>
      <h1 className="border-l-2 border-bg pl-1 text-2xl font-bold text-white">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-white/80">{subtitle}</p> : null}
      {children}
    </header>
  );
}
