import { Client } from "@notionhq/client";
import { getCollections } from "./notion.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// No server da Vercel o relógio é UTC. Um "zerado hoje" às 22h de Brasília seria
// gravado como o dia seguinte — por isso a data sai sempre no fuso do usuário.
const TIMEZONE = "America/Sao_Paulo";

/** @returns {string} data de hoje (YYYY-MM-DD) no fuso do usuário */
export function today() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: TIMEZONE }).format(new Date());
}

async function dataSourceIdFor(section, year) {
  const collections = await getCollections();
  const collection = (collections[section] ?? []).find((c) => c.year === Number(year));
  if (!collection) throw new Error(`Não existe tabela de ${section} para ${year}`);
  return collection.dataSourceId;
}

/** Opções reais das propriedades (rating/genres) — evita inventar nome de opção. */
export async function getOptions(section, year) {
  const dataSourceId = await dataSourceIdFor(section, year);
  const source = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
  const properties = source.properties ?? {};
  return {
    ratings: (properties.rating?.select?.options ?? []).map((o) => o.name),
    genres: (properties.genres?.multi_select?.options ?? []).map((o) => ({
      name: o.name,
      color: o.color,
    })),
  };
}

// --- construtores de propriedade -------------------------------------------
const pTitle = (v) => ({ title: [{ text: { content: v } }] });
const pRich = (v) => ({ rich_text: v ? [{ text: { content: v } }] : [] });
const pSelect = (v) => ({ select: v ? { name: v } : null });
const pDate = (v) => ({ date: v ? { start: v } : null });
const pCheck = (v) => ({ checkbox: Boolean(v) });
const pMulti = (names) => ({ multi_select: (names ?? []).map((name) => ({ name })) });
// Capa sempre como URL externa (estável). Arquivo enviado pro Notion geraria
// URL assinada que expira em ~1h e quebraria o cache das páginas. Se a URL vier
// do próprio Notion (capa de item antigo, por exemplo), falha aqui com uma
// mensagem clara em vez do validation_error críptico da API.
const pFile = (url) => {
  if (url && url.toLowerCase().includes("notion")) {
    throw new Error(
      "Essa capa é um arquivo hospedado no Notion (URL assinada que expira). Use uma URL externa, tipo IGDB ou Amazon.",
    );
  }
  return {
    files: url ? [{ type: "external", name: "capa", external: { url } }] : [],
  };
};

/** @param {string|number} year */
export async function createGame(year, data) {
  const dataSourceId = await dataSourceIdFor("jogos", year);
  const done = Boolean(data.done);
  const page = await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: {
      name: pTitle(data.name),
      poster: pFile(data.poster),
      release: pDate(data.release),
      genres: pMulti(data.genres),
      notes: pRich(data.notes),
      rating: pSelect(data.rating),
      done: pCheck(done),
      done_date: pDate(done ? (data.doneDate ?? today()) : null),
      done_achievements: pCheck(data.doneAchievements),
    },
  });
  return page.id;
}

/** @param {string} pageId */
export async function updateGame(pageId, patch) {
  const properties = {};
  if ("name" in patch) properties.name = pTitle(patch.name);
  if ("poster" in patch) properties.poster = pFile(patch.poster);
  if ("release" in patch) properties.release = pDate(patch.release);
  if ("genres" in patch) properties.genres = pMulti(patch.genres);
  if ("notes" in patch) properties.notes = pRich(patch.notes);
  if ("rating" in patch) properties.rating = pSelect(patch.rating);
  if ("doneAchievements" in patch) properties.done_achievements = pCheck(patch.doneAchievements);
  if ("done" in patch) {
    properties.done = pCheck(patch.done);
    // zerou agora -> carimba a data; desmarcou -> limpa a data
    properties.done_date = pDate(patch.done ? (patch.doneDate ?? today()) : null);
  }
  if (!Object.keys(properties).length) return;
  await notion.pages.update({ page_id: pageId, properties });
}

/** @param {string|number} year */
export async function createBook(year, data) {
  const dataSourceId = await dataSourceIdFor("livros", year);
  const done = Boolean(data.done);
  const page = await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: {
      name: pTitle(data.name),
      poster: pFile(data.poster),
      author: pRich(data.author),
      quote: pRich(data.quote),
      genres: pMulti(data.genres),
      rating: pSelect(data.rating),
      done: pCheck(done),
      done_date: pDate(done ? (data.doneDate ?? today()) : null),
    },
  });
  return page.id;
}

/** @param {string} pageId */
export async function updateBook(pageId, patch) {
  const properties = {};
  if ("name" in patch) properties.name = pTitle(patch.name);
  if ("poster" in patch) properties.poster = pFile(patch.poster);
  if ("author" in patch) properties.author = pRich(patch.author);
  if ("quote" in patch) properties.quote = pRich(patch.quote);
  if ("genres" in patch) properties.genres = pMulti(patch.genres);
  if ("rating" in patch) properties.rating = pSelect(patch.rating);
  if ("done" in patch) {
    properties.done = pCheck(patch.done);
    properties.done_date = pDate(patch.done ? (patch.doneDate ?? today()) : null);
  }
  if (!Object.keys(properties).length) return;
  await notion.pages.update({ page_id: pageId, properties });
}

/** Manda pro lixo do Notion (reversível por lá). */
export async function archivePage(pageId) {
  await notion.pages.update({ page_id: pageId, in_trash: true });
}
