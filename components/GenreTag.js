import { genreClass } from "@/lib/notionColors";

export default function GenreTag({ name, color }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${genreClass(color)}`}>
      {name}
    </span>
  );
}
