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

// Public-write endpoints. Each accepts only POST without a session; all
// other methods still require auth and the route itself also calls
// requireAuth (defense in depth).
const PUBLIC_POST_ROUTES = new Set<string>([
  "/api/appointments",
  "/api/contact",
]);

// State-changing HTTP methods we apply the CSRF origin check to.
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isPublic(pathname: string, method: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (method === "POST" && PUBLIC_POST_ROUTES.has(pathname)) return true;
  return false;
}

/**
 * Reject cross-origin state-changing requests. The session cookie is
 * already SameSite=Lax which blocks most cross-site form attacks, but
 * the Origin/Referer check covers same-site sub-domains and browsers
 * that don't enforce SameSite. We allow the request when:
 *   - the method is safe (GET/HEAD/OPTIONS), or
 *   - Origin (or fallback Referer) is present AND its host matches the
 *     host the request was sent to.
 */
function isSameOriginMutation(request: NextRequest): boolean {
  if (!MUTATING_METHODS.has(request.method)) return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expectedHost = request.headers.get("host");
  if (!expectedHost) return false;

  const candidate = origin ?? referer;
  if (!candidate) {
    // Some legitimate clients omit both, but a browser fetch will always
    // attach Origin for cross-origin requests; same-origin POSTs from
    // our own pages also include it. Reject anything else.
    return false;
  }
  try {
    const url = new URL(candidate);
    return url.host === expectedHost;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // CSRF check runs FIRST for any mutating request, even public ones.
  // For public POST endpoints (appointments, contact), this also blocks
  // off-origin abuse like an attacker site trying to spam our DB.
  if (MUTATING_METHODS.has(method) && !isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Cross-origin request rejected.", code: "csrf_blocked" },
      { status: 403 }
    );
  }

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
