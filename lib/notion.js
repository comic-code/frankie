import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const DATABASES = {
  games: process.env.NOTION_GAMES,
  books: process.env.NOTION_BOOKS,
};

// A API atual do Notion (versão 2025-09-03) fala em "data sources": uma tabela
// pode ter uma ou mais fontes de dados, e é o id da FONTE que vai nas consultas
// — `databases.query` deixou de existir nas SDKs novas. Resolvemos o id na
// primeira chamada e guardamos em memória do processo (o serverless reaproveita
// entre requisições; a página ainda é cacheada pelo ISR).
const dataSourceCache = new Map();

/** @param {string} databaseId */
export async function dataSourceId(databaseId) {
  if (!dataSourceCache.has(databaseId)) {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    const source = database.data_sources?.[0];
    if (!source) {
      throw new Error(`Tabela ${databaseId} não tem data source (compartilhada com a integração?)`);
    }
    dataSourceCache.set(databaseId, source.id);
  }
  return dataSourceCache.get(databaseId);
}

/**
 * @typedef {{ name: string, color: string }} Genre
 *
 * @typedef {object} Game
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} poster
 * @property {string|null} release          data de lançamento (YYYY-MM-DD)
 * @property {boolean}     done             zerado
 * @property {string|null} doneDate
 * @property {boolean}     doneAchievements 100% / platinado
 * @property {string}      notes
 * @property {string|null} rating           ex: "4.5 / 5.0 ⭐️"
 * @property {Genre[]}     genres
 *
 * @typedef {object} Book
 * @property {string}      id
 * @property {string}      name
 * @property {string}      author
 * @property {string}      quote
 * @property {string|null} poster
 * @property {boolean}     done
 * @property {string|null} doneDate
 * @property {string|null} rating
 * @property {Genre[]}     genres
 */

// --- leitores de propriedades do Notion ------------------------------------
// O controller antigo lia `files[0].external.url` na cara e quebrava (TypeError)
// quando a capa era um arquivo hospedado no Notion. Aqui os dois casos entram.
const cover = (prop) => {
  const file = prop?.files?.[0];
  if (!file) return null;
  return file.external?.url ?? file.file?.url ?? null;
};
const title = (prop) => prop?.title?.[0]?.plain_text ?? "";
const richText = (prop) => prop?.rich_text?.[0]?.plain_text ?? "";
const choice = (prop) => prop?.select?.name ?? null;
const date = (prop) => prop?.date?.start ?? null;
const checkbox = (prop) => Boolean(prop?.checkbox);
const tags = (prop) => (prop?.multi_select ?? []).map(({ name, color }) => ({ name, color }));

// A API devolve no máximo 100 itens por página — o código antigo lia só a
// primeira e perdia o resto da lista em silêncio.
async function queryAll(databaseId, sorts) {
  const results = [];
  let cursor;
  do {
    const page = await notion.dataSources.query({
      data_source_id: await dataSourceId(databaseId),
      sorts,
      page_size: 100,
      start_cursor: cursor,
    });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

/** @returns {Promise<Game[]>} */
export async function getGames() {
  const rows = await queryAll(DATABASES.games, [
    { property: "done", direction: "ascending" },
  ]);

  return rows.map((row) => {
    const p = row.properties;
    return {
      id: row.id,
      name: title(p.name),
      poster: cover(p.poster),
      release: date(p.release),
      done: checkbox(p.done),
      doneDate: date(p.done_date),
      doneAchievements: checkbox(p.done_achievements),
      notes: richText(p.notes),
      rating: choice(p.rating),
      genres: tags(p.genres),
    };
  });
}

/** @returns {Promise<Book[]>} */
export async function getBooks() {
  const rows = await queryAll(DATABASES.books, [
    { property: "done", direction: "ascending" },
  ]);

  return rows.map((row) => {
    const p = row.properties;
    return {
      id: row.id,
      name: title(p.name),
      author: richText(p.author),
      quote: richText(p.quote),
      poster: cover(p.poster),
      done: checkbox(p.done),
      doneDate: date(p.done_date),
      rating: choice(p.rating),
      genres: tags(p.genres),
    };
  });
}
