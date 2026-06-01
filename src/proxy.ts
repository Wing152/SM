import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Essential public routes and assets that should never be blocked
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiRoute = pathname.startsWith("/api");
  const isNextStatic = pathname.startsWith("/_next") || pathname.startsWith("/icons");
  const isStaticFile = pathname.includes(".") || pathname.endsWith(".json");

  // Allow all API routes, Auth pages, and static assets to pass through the middleware
  if (isAuthPage || isApiRoute || isNextStatic || isStaticFile) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "6f9b8c7d6e5a4b3c2d1e0f9a8b7c6d5e"
  });

  // Redirect to login if no token and trying to access protected content
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
