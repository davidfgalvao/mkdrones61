import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startSession() {
  const token = await createSessionToken();
  if (!token) return false;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
