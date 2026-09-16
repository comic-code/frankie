// Cliente do IGDB direto por fetch — sem dependência extra (o projeto antigo
// usava `igdb-api-node`, que é só um envelope fino sobre isso).
// IGDB exige um token do Twitch (client credentials) que dura ~60 dias; fica
// memoizado no processo e é renovado 1 min antes de vencer.
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const API_URL = "https://api.igdb.com/v4/games";

let tokenCache = { value: null, expiresAt: 0 };

async function accessToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("TWITCH_CLIENT_ID/TWITCH_CLIENT_SECRET não configurados");
  }

  const res = await fetch(
    `${TOKEN_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST", cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Twitch recusou o token (${res.status})`);

  const data = await res.json();
  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(data.expires_in - 60, 60) * 1000,
  };
  return tokenCache.value;
}

const coverUrl = (imageId) =>
  imageId ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg` : null;

// IGDB devolve data em unix (segundos)
const toDate = (unix) => (unix ? new Date(unix * 1000).toISOString().slice(0, 10) : null);

// ordem de exibição por tipo de jogo: principal primeiro, DLC/pacote por último
const TYPE_ORDER = [0, 9, 8, 10, 11, 4, 1, 2, 3, 6];
const typeRank = (type) => {
  const index = TYPE_ORDER.indexOf(type);
  return index === -1 ? TYPE_ORDER.length : index;
};

// rótulo do tipo — DLC não é lixo (você tem Phantom Liberty na lista), mas
// precisa estar visível pra não adicionar "Blood and Wine" pensando que é o jogo
const TYPE_LABELS = {
  1: "DLC",
  2: "expansão",
  3: "pacote",
  4: "standalone",
  6: "episódio",
  8: "remake",
  9: "remaster",
  10: "edição expandida",
  11: "port",
};

// o termo vai entre aspas na linguagem de consulta (Apicalypse): tirar aspas evita quebrar
const sanitize = (value) => value.replace(/["\\]/g, " ").trim();

/**
 * @typedef {{ igdbId: number, name: string, poster: string|null, release: string|null, genres: string[], platforms: string[] }} IgdbGame
 */

/**
 * Busca no IGDB.
 *
 * Duas armadilhas aprendidas na prática:
 * 1. o campo `category` foi DEPRECADO pelo IGDB — quem filtra por ele recebe
 *    lista vazia sem erro nenhum. O campo atual é `game_type`.
 * 2. sem filtro, a busca traz mod, pack de DLC e update no meio dos jogos.
 *
 * @param {string} query
 * @returns {Promise<IgdbGame[]>}
 */
export async function searchGames(query, limit = 12) {
  const term = sanitize(query);
  if (term.length < 2) return [];

  const [token, clientId] = [await accessToken(), process.env.TWITCH_CLIENT_ID];
  const body = [
    `search "${term}"`,
    "fields name, first_release_date, cover.image_id, genres.name, platforms.name, game_type",
    // 5=mod, 7=temporada, 12=fork, 13=pacote, 14=update
    "where game_type != 5 & game_type != 7 & game_type != 12 & game_type != 13 & game_type != 14",
    `limit ${limit}`,
  ].join("; ") + ";";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`IGDB respondeu ${res.status}`);

  const games = await res.json();
  const seen = new Set();

  return games
    // jogo principal antes de remake/remaster, e esses antes de DLC/pacote
    .sort((a, b) => typeRank(a.game_type) - typeRank(b.game_type))
    .filter((game) => {
      const key = game.name?.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((game) => ({
      igdbId: game.id,
      name: game.name,
      poster: coverUrl(game.cover?.image_id),
      release: toDate(game.first_release_date),
      genres: (game.genres ?? []).map((genre) => genre.name),
      platforms: (game.platforms ?? []).slice(0, 3).map((platform) => platform.name),
      typeLabel: TYPE_LABELS[game.game_type] ?? null,
    }));
}
