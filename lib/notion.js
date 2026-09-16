import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Seções que o painel mostra hoje. A chave é o "slug" do nome da tabela:
// "2026 - Jogos" -> seção "jogos", ano 2026. Criou "2027 - Jogos" no Notion?
// Aparece sozinho aqui, sem mexer em env var nem em código.
const SECTIONS = {
  jogos: "Jogos",
  livros: "Livros",
};

const TITLE_PATTERN = /^(\d{4})\s*-\s*(.+)$/;

const toPlainText = (rich) => (rich ?? []).map((part) => part.plain_text).join("").trim();

const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * @typedef {{ year: number, title: string, dataSourceId: string }} Collection
 * @typedef {Record<string, Collection[]>} CollectionsBySection
 */

// O `search` não passa pelo cache do Next (é SDK, não fetch), então memoizo por
// 5 min: acompanha o ISR das páginas e evita chamada extra a cada request.
const CACHE_MS = 5 * 60 * 1000;
let cache = { at: 0, data: /** @type {CollectionsBySection|null} */ (null) };

/** @returns {Promise<CollectionsBySection>} */
export async function getCollections() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  const results = [];
  let cursor;
  do {
    const page = await notion.search({ page_size: 100, start_cursor: cursor });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  const bySection = {};

  for (const item of results) {
    // A API atual devolve as tabelas compartilhadas como "data_source"
    // (o id que as consultas usam) — não como "database".
    if (item.object !== "data_source") continue;

    const match = toPlainText(item.title).match(TITLE_PATTERN);
    if (!match) continue;

    const year = Number(match[1]);
    const section = slugify(match[2]);
    if (!SECTIONS[section]) continue;

    (bySection[section] ??= []).push({
      year,
      title: toPlainText(item.title),
      dataSourceId: item.id,
    });
  }

  // ano mais recente primeiro — é o que a navegação abre por padrão
  for (const section of Object.keys(bySection)) {
    bySection[section].sort((a, b) => b.year - a.year);
  }

  cache = { at: Date.now(), data: bySection };
  return bySection;
}

/** Anos disponíveis numa seção, do mais novo pro mais antigo. @returns {Promise<number[]>} */
export async function getYears(section) {
  const collections = await getCollections();
  return (collections[section] ?? []).map((collection) => collection.year);
}

// --- leitores de propriedades do Notion ------------------------------------
// O controller antigo lia `files[0].external.url` na cara e quebrava (TypeError)
// quando a capa era um arquivo hospedado no Notion. Aqui os dois casos entram.
const cover = (prop) => {
  const file = prop?.files?.[0];
  if (!file) return null;
  return file.external?.url ?? file.file?.url ?? null;
};
const titleOf = (prop) => prop?.title?.[0]?.plain_text ?? "";
const richText = (prop) => prop?.rich_text?.[0]?.plain_text ?? "";
const choice = (prop) => prop?.select?.name ?? null;
const date = (prop) => prop?.date?.start ?? null;
const checkbox = (prop) => Boolean(prop?.checkbox);
const tags = (prop) => (prop?.multi_select ?? []).map(({ name, color }) => ({ name, color }));

// A API devolve no máximo 100 itens por página — o código antigo lia só a
// primeira e perdia o resto da lista em silêncio.
async function queryAll(dataSourceId, sorts) {
  const results = [];
  let cursor;
  do {
    const page = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts,
      page_size: 100,
      start_cursor: cursor,
    });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

const SORTS = [{ property: "done", direction: "ascending" }];

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

const mapGame = (row) => {
  const p = row.properties;
  return {
    id: row.id,
    name: titleOf(p.name),
    poster: cover(p.poster),
    release: date(p.release),
    done: checkbox(p.done),
    doneDate: date(p.done_date),
    doneAchievements: checkbox(p.done_achievements),
    notes: richText(p.notes),
    rating: choice(p.rating),
    genres: tags(p.genres),
  };
};

const mapBook = (row) => {
  const p = row.properties;
  return {
    id: row.id,
    name: titleOf(p.name),
    author: richText(p.author),
    quote: richText(p.quote),
    poster: cover(p.poster),
    done: checkbox(p.done),
    doneDate: date(p.done_date),
    rating: choice(p.rating),
    genres: tags(p.genres),
  };
};

async function rowsFor(section, year) {
  const collections = await getCollections();
  const collection = (collections[section] ?? []).find((c) => c.year === Number(year));
  if (!collection) return null;
  return queryAll(collection.dataSourceId, SORTS);
}

/** @param {string|number} year @returns {Promise<Game[]|null>} null = ano sem tabela */
export async function getGames(year) {
  const rows = await rowsFor("jogos", year);
  return rows === null ? null : rows.map(mapGame);
}

/** @param {string|number} year @returns {Promise<Book[]|null>} null = ano sem tabela */
export async function getBooks(year) {
  const rows = await rowsFor("livros", year);
  return rows === null ? null : rows.map(mapBook);
}
