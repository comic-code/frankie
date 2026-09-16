"use server";

import { revalidatePath } from "next/cache";
import {
  createGame,
  updateGame,
  createBook,
  updateBook,
  archivePage,
} from "@/lib/writes";

const SECTIONS = { jogos: "jogos", livros: "livros" };

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function refresh(section, year) {
  revalidatePath(`/${SECTIONS[section]}/${year}`);
  revalidatePath(`/${SECTIONS[section]}`);
}

/** Cria jogo (campos: ano, name, poster, release, notes, genres[]) */
export async function createGameAction(formData) {
  const year = text(formData, "ano");
  const name = text(formData, "name");
  if (!name) return;

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

  await createBook(year, {
    name,
    author: text(formData, "author"),
    poster: text(formData, "poster") || null,
    quote: text(formData, "quote"),
    genres: formData.getAll("genres").map(String),
  });
  refresh("livros", year);
}

/** Marca/desmarca zerado|lido — done_date é carimbada pela camada de escrita */
export async function toggleDoneAction(formData) {
  const section = text(formData, "section");
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const done = text(formData, "done") === "true";

  if (section === "jogos") await updateGame(id, { done });
  else await updateBook(id, { done });
  refresh(section, year);
}

/** Edição completa da linha (nome, nota, lançamento, gêneros, notas) */
export async function updateGameAction(formData) {
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) throw new Error("o jogo precisa de um nome");

  await updateGame(id, {
    name,
    rating: text(formData, "rating") || null,
    release: text(formData, "release") || null,
    genres: formData.getAll("genres").map(String),
    notes: text(formData, "notes"),
  });
  refresh("jogos", year);
}

/** Edição completa da linha (título, autor, nota, gêneros, citação) */
export async function updateBookAction(formData) {
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) throw new Error("o livro precisa de um título");

  await updateBook(id, {
    name,
    author: text(formData, "author"),
    rating: text(formData, "rating") || null,
    genres: formData.getAll("genres").map(String),
    quote: text(formData, "quote"),
  });
  refresh("livros", year);
}

/** 100% / platinado (só jogos) */
export async function toggleAchievementsAction(formData) {
  const year = text(formData, "ano");
  const id = text(formData, "id");
  const next = text(formData, "next") === "true";

  await updateGame(id, { doneAchievements: next });
  refresh("jogos", year);
}

/** Remove (manda pro lixo do Notion — dá pra restaurar por lá) */
export async function archiveAction(formData) {
  const section = text(formData, "section");
  const year = text(formData, "ano");
  const id = text(formData, "id");

  await archivePage(id);
  refresh(section, year);
}
