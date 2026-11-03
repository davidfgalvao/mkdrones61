const encoder = new TextEncoder();

export const SESSION_COOKIE = "ga_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 12;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string) {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/") + pad);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(signature);
}

export async function safeEqual(left: string, right: string) {
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(a);
  const rightBytes = new Uint8Array(b);
  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }
  return diff === 0;
}

function secret() {
  const value = process.env.AUTH_SECRET?.trim() ?? "";
  return value.length >= 16 ? value : null;
}

export function adminConfigured() {
  return Boolean(
    secret() && process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD,
  );
}

export async function createSessionToken() {
  const key = secret();
  if (!key) return null;
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify({ exp: Date.now() + MAX_AGE_MS })),
  );
  const signature = bytesToBase64Url(await hmac(key, payload));
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string) {
  const key = secret();
  if (!key) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = bytesToBase64Url(await hmac(key, payload));
  if (!(await safeEqual(expected, signature))) return null;
  try {
    const json = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      exp?: number;
    };
    if (!json.exp || json.exp < Date.now()) return null;
    return { exp: json.exp };
  } catch {
    return null;
  }
}

export function safeAdminPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return "/admin";
  }
  if (value.startsWith("/admin/login")) return "/admin";
  return value;
}
