// Barra colorida no topo da lista (o ListHeader antigo): fundo na cor da seção,
// título branco com borda interna no tom do fundo.
export default function SectionHeader({ title, subtitle, tone = "orange" }) {
  const background = tone === "green" ? "bg-green-2" : "bg-orange-alt";

  return (
    <header className={`anim-forward-left w-[40rem] max-w-full rounded-t-lg p-4 ${background}`}>
      <h1 className="border-l-2 border-bg pl-1 text-2xl font-bold text-white">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-white/80">{subtitle}</p> : null}
    </header>
  );
}
