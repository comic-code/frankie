import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

// Next 16 renomeou a convenção: `middleware.js` virou `proxy.js` (mesma ideia,
// roda antes de qualquer página ou Server Action).
// Rotas que precisam ficar abertas (a tela de login e os arquivos do Next).
const PUBLIC = ["/login", "/_next", "/favicon.ico", "/robots.txt"];

export default async function proxy(request) {
  // GATE=off desliga o cadeado (útil só em teste local)
  if (process.env.GATE === "off") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Falha fechada: gate ligado sem senha configurada bloqueia tudo, em vez de
  // deixar o painel aberto por esquecimento.
  if (!process.env.APP_PASSWORD) {
    return new NextResponse(
      "Gate ligado, mas APP_PASSWORD não está configurada. Defina a env ou rode com GATE=off.",
      { status: 503 },
    );
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (await verifyToken(token)) return NextResponse.next();

  // Server Action é POST — não faz sentido redirecionar; responde não autorizado.
  if (request.method !== "GET") {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
