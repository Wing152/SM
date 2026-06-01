import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "6f9b8c7d6e5a4b3c2d1e0f9a8b7c6d5e"
  });

  const { pathname } = req.nextUrl;

  // Protect all routes except login, signup, api, and static assets
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiRoute = pathname.startsWith("/api");
  const isPublicAsset =
    pathname.endsWith(".json") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons");

  if (!token && !isAuthPage && !isApiRoute && !isPublicAsset) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
