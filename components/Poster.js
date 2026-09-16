// Capa: 5rem × 109px como no app antigo. Sem `next/image` de propósito — as
// URLs já são externas e estáveis (IGDB / Amazon) e o otimizador da Vercel tem
// cota no plano free; um `<img>` aqui não custa nada pro tamanho da lista.
export default function Poster({ src, alt }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="h-[109px] w-20 shrink-0 rounded-[3px] border-2 border-bg bg-black/30"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      width={80}
      height={109}
      loading="lazy"
      className="h-[109px] w-20 shrink-0 rounded-[3px] border-2 border-bg object-cover"
    />
  );
}
