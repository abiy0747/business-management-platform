import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always let the login page and the NextAuth API through.
  if (
    pathname === LOGIN_PATH ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Verify the NextAuth session JWT. A missing or
  // undecryptable token means the visitor is signed out,
  // so redirect them to the login page.
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};