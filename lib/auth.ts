// Backwards-compatible re-exports. New code should import directly from
// `@/lib/auth/server` and `@/lib/auth/jwt`.

export {
  getCurrentUser,
  getCurrentUser as getAuthUser,
  requireAuth,
  requireRole,
  branchFilterFor,
  type AuthUser,
} from "./auth/server";
