// Autenticação do painel: um cookie assinado, sem estado no servidor.
// Usa Web Crypto (disponível tanto no middleware/Edge quanto no Node), então o
// mesmo código vale nos dois lados.
const encoder = new TextEncoder();

export const COOKIE_NAME = "frankie_auth";
export const MAX_AGE = 60 * 60 * 24 * 180; // 180 dias — login persistente

const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET não configurado");
  return value;
};

const hmacKey = () =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const toHex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

/**
 * Digest da senha: comparar digests de tamanho fixo evita vazar o tamanho da
 * senha e permite usar timingSafeEqual (comparação em tempo constante).
 * @returns {Promise<Uint8Array>}
 */
export async function passwordDigest(value) {
  const digest = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(value));
  return new Uint8Array(digest);
}

/** Cookie no formato "expiraEm.assinatura" — a senha nunca entra aqui. */
export async function createToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(String(expires)));
  return `${expires}.${toHex(signature)}`;
}

/** @param {string|undefined} token */
export async function verifyToken(token) {
  if (!token || !process.env.AUTH_SECRET) return false;

  const [expiresRaw, signature] = token.split(".");
  const expires = Number(expiresRaw);
  if (!expires || !signature || expires < Date.now()) return false;

  const expected = toHex(
    await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(String(expires))),
  );
  return expected === signature;
}
