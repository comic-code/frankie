import { NextResponse } from "next/server";
import { searchGames } from "@/lib/igdb";

// Cache curto por consulta: quem digita "hollow knight" letra por letra faz 1
// chamada ao IGDB, não 10. O IGDB leva ~2s por busca, então isso importa.
const cache = new Map();
const TTL = 10 * 60 * 1000;
const MAX_ENTRIES = 100;

export async function GET(request) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const key = query.toLowerCase();

  if (key.length < 2) return NextResponse.json({ results: [] });

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) {
    return NextResponse.json({ results: hit.results, cached: true });
  }

  try {
    const results = await searchGames(query);
    cache.set(key, { at: Date.now(), results });
    if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
