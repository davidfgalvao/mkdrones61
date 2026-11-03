import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api/admin");
  if (!isAdmin && !isApi) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (session) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
