import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/jwt";

// Middleware is a first line of defense, not the only one. Every internal
// API route also calls `requireAuth` / `requireRole` so that direct calls
// from any source still go through server-side authz checks.

const PUBLIC_PREFIXES = [
  "/auth",
  "/api/auth",
  "/_next",
  "/brand",
  "/gallery",
  "/favicon.ico",
];

const PUBLIC_EXACT = new Set<string>([
  "/",
  "/about",
  "/book",
  "/branches",
  "/contact",
  "/services",
  "/unity",
  "/robots.txt",
  "/sitemap.xml",
]);

// Only this public-write API endpoint is allowed without a session.
const PUBLIC_APPOINTMENT_BOOKING = "/api/appointments";

function isPublic(pathname: string, method: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  // Booking: only POST is public. All other methods (GET listing, etc.)
  // require auth and are enforced by the route's own requireAuth call too.
  if (pathname === PUBLIC_APPOINTMENT_BOOKING && method === "POST") {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (isPublic(pathname, method)) {
    return NextResponse.next();
  }

  // Everything else requires a valid session cookie.
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = await verifySession(token);

  if (!claims) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized", code: "unauthorized" },
        { status: 401 }
      );
    }
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
