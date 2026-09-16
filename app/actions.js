"use server";

import { revalidatePath } from "next/cache";
import {
  createGame,
  updateGame,
  createBook,
  updateBook,
  archivePage,
} from "@/lib/writes";
import { currentYear } from "@/lib/format";

const SECTIONS = { jogos: "jogos", livros: "livros" };

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function refresh(section, year) {
  revalidatePath(`/${SECTIONS[section]}/${year}`);
  revalidatePath(`/${SECTIONS[section]}`);
}

/**
 * Só o ano corrente aceita escrita. A regra vale AQUI, no servidor — esconder o
 * botão na tela é cosmético; qualquer POST direto na action continua possível.
 */
function assertEditable(year) {
  if (String(year) !== String(currentYear())) {
    throw new Error(`${year} é ano arquivado — só visualização`);
  }
}

/** Cria jogo (campos: ano, name, poster, release, notes, genres[]) */
export async function createGameAction(formData) {
  const year = text(formData, "ano");
  const name = text(formData, "name");
  if (!name) return;
  assertEditable(year);

  await createGame(year, {
    name,
    poster: text(formData, "poster") || null,
    release: text(formData, "release") || null,
    notes: text(formData, "notes"),
    genres: formData.getAll("genres").map(String),
  });
  refresh("jogos", year);
}

/** Cria livro (campos: ano, name, author, poster, quote, genres[]) */
export async function createBookAction(formData) {
  const year = text(formData, "ano");
  const name = text(formData, "name");
  if (!name) return;
  assertEditable(year);

  await createBook(year, {
    name,
    author: text(formData, "author"),
    poster: text(formData, "poster") || null,
    quote: text(formData, "quote"),
    genres: formData.getAll("genres").map(String),
  });
  refresh("livros", year);
}

/**
 * Edição completa da linha: nome, nota, lançamento, gêneros, notas, zerado e 100%.
 * Os campos "before" vêm escondidos no formulário pra saber se zerado/100%
 * realmente mudaram — sem isso, editar o nome de um jogo já zerado reescreveria
 * a data do zerado para hoje.
 */
export async function updateGameAction(formData) {
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) throw new Error("o jogo precisa de um nome");
  assertEditable(year);

  const done = formData.get("done") === "on";
  const doneBefore = text(formData, "doneBefore") === "1";
  const achievements = formData.get("achievements") === "on";
  const achievementsBefore = text(formData, "achievementsBefore") === "1";

  await updateGame(id, {
    name,
    rating: text(formData, "rating") || null,
    release: text(formData, "release") || null,
    genres: formData.getAll("genres").map(String),
    notes: text(formData, "notes"),
    ...(done !== doneBefore ? { done } : {}),
    ...(achievements !== achievementsBefore ? { doneAchievements: achievements } : {}),
  });
  refresh("jogos", year);
}

/** Edição completa da linha: título, autor, nota, gêneros, citação e lido */
export async function updateBookAction(formData) {
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) throw new Error("o livro precisa de um título");
  assertEditable(year);

  const done = formData.get("done") === "on";
  const doneBefore = text(formData, "doneBefore") === "1";

  await updateBook(id, {
    name,
    author: text(formData, "author"),
    rating: text(formData, "rating") || null,
    genres: formData.getAll("genres").map(String),
    quote: text(formData, "quote"),
    ...(done !== doneBefore ? { done } : {}),
  });
  refresh("livros", year);
}

/** Remove (manda pro lixo do Notion — dá pra restaurar por lá) */
export async function archiveAction(formData) {
  const section = text(formData, "section");
  const year = text(formData, "ano");
  const id = text(formData, "id");
  assertEditable(year);

  await archivePage(id);
  refresh(section, year);
}
