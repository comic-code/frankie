// A cor dos gêneros vem do Notion: cada opção de multi_select tem um "color"
// (default | gray | brown | orange | yellow | green | blue | purple | pink | red).
// Aqui os nomes viram classes do Tailwind. Onde havia equivalente na paleta da
// aplicação, ele foi usado; os demais são escolhas novas, sujeitas a revisão.
const CLASSES = {
  default: "border-fg/25 bg-fg/5 text-fg/80",
  gray: "border-notion-gray/40 bg-notion-gray/10 text-notion-gray",
  brown: "border-notion-brown/40 bg-notion-brown/10 text-notion-brown",
  orange: "border-orange-alt/50 bg-orange-alt/10 text-orange-alt",
  yellow: "border-yellow/50 bg-yellow/10 text-yellow",
  green: "border-green/50 bg-green/10 text-green",
  blue: "border-notion-blue/40 bg-notion-blue/10 text-notion-blue",
  purple: "border-notion-purple/40 bg-notion-purple/10 text-notion-purple",
  pink: "border-pink/50 bg-pink/10 text-pink",
  red: "border-notion-red/40 bg-notion-red/10 text-notion-red",
};

export function genreClass(color) {
  return CLASSES[color] ?? CLASSES.default;
}
