// Server-side auth helpers for use inside API route handlers and React
// Server Components. The single source of truth for identity is the
// HTTP-only `auth_token` cookie. We never trust localStorage, headers, or
// query params for authorization decisions.

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession, type SessionClaims } from "./jwt";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  branch: string;
}

function claimsToUser(claims: SessionClaims): AuthUser {
  return {
    id: claims.id,
    email: claims.email,
    role: claims.role,
    branch: claims.branch,
  };
}

/**
 * Resolve the current user from the request cookie. Works in API routes
 * (Node runtime) and from React Server Components.
 *
 * - In an API route, pass the `NextRequest`. We read the cookie off it.
 * - In a Server Component, omit the argument. We read from `cookies()`.
 *
 * Returns `null` when there is no session or the token is invalid/expired.
 */
export async function getCurrentUser(
  request?: NextRequest
): Promise<AuthUser | null> {
  let token: string | undefined;
  if (request) {
    token = request.cookies.get(SESSION_COOKIE)?.value;
  } else {
    const store = await cookies();
    token = store.get(SESSION_COOKIE)?.value;
  }
  const claims = await verifySession(token);
  return claims ? claimsToUser(claims) : null;
}

const UNAUTHORIZED = NextResponse.json(
  { error: "Unauthorized", code: "unauthorized" },
  { status: 401 }
);

const FORBIDDEN = NextResponse.json(
  { error: "Forbidden", code: "forbidden" },
  { status: 403 }
);

type AuthSuccess = { ok: true; user: AuthUser };
type AuthFailure = { ok: false; response: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

/**
 * Returns the authenticated user, or an error response to forward straight
 * back to the client. Always check `.ok` before reading `.user`.
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const user = await getCurrentUser(request);
  if (!user) return { ok: false, response: UNAUTHORIZED };
  return { ok: true, user };
}

/**
 * Like `requireAuth` but also enforces a role. `"manager"` is the only role
 * with global access; everything else is a branch-scoped staff role and
 * must additionally pass branch-isolation checks where applicable.
 */
export async function requireRole(
  request: NextRequest,
  role: "manager" | "staff"
): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;
  if (role === "manager" && auth.user.role !== "manager") {
    return { ok: false, response: FORBIDDEN };
  }
  // "staff" is satisfied by any authenticated non-empty role.
  if (role === "staff" && !auth.user.role) {
    return { ok: false, response: FORBIDDEN };
  }
  return auth;
}

/**
 * Branch-isolation helper. Managers can access any branch. Staff can only
 * access their own branch. Returns the effective branch filter to apply to
 * queries (or null when no filter is needed because the user is a manager).
 */
export function branchFilterFor(user: AuthUser): string | null {
  return user.role === "manager" ? null : user.branch;
}
