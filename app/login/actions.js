"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createToken, passwordDigest, COOKIE_NAME, MAX_AGE } from "@/lib/auth";

export async function loginAction(formData) {
  const given = String(formData.get("password") ?? "");
  const expected = process.env.APP_PASSWORD ?? "";
  const next = String(formData.get("next") ?? "") || "/jogos";

  // compara digests de tamanho fixo, em tempo constante
  const [a, b] = await Promise.all([passwordDigest(given), passwordDigest(expected)]);
  const ok = expected.length > 0 && timingSafeEqual(a, b);

  if (!ok) {
    redirect(`/login?erro=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(COOKIE_NAME, await createToken(), {
    httpOnly: true, // JavaScript da página não lê o cookie
    secure: process.env.NODE_ENV === "production", // em http://localhost não daria pra logar
    sameSite: "lax", // corta CSRF básico
    path: "/",
    maxAge: MAX_AGE,
  });

  redirect(next);
}
