import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. PUBLIC ASSETS & SPECIAL FILES
  // Never block static assets, manifest, icons, or service worker
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. AUTH ROUTES
  // Always allow login, signup, and all auth-related API calls
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // 3. OTHER API ROUTES
  // Let API routes handle their own authentication (return 401 instead of redirecting)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 4. PROTECTED PAGES
  // All other routes require a valid session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "6f9b8c7d6e5a4b3c2d1e0f9a8b7c6d5e"
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Broad matcher, logic inside handles exclusion
  matcher: ["/:path*"],
};
