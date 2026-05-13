// Centralized JWT signing/verification.
//
// JWT_SECRET is read lazily and fails fast at the *first* request that
// touches auth, not at module evaluation time. We keep evaluation cheap so
// that `next build` and `tsc --noEmit` don't require real secrets.
//
// In production we require JWT_SECRET to be set. In dev we still require it;
// there is no fallback. The previous "your-secret-key-change-in-production"
// fallback was a critical vulnerability — anyone who deployed without setting
// the env var could mint manager tokens.

import jwt, { type SignOptions } from "jsonwebtoken";
import { jwtVerify, type JWTPayload } from "jose";

export interface SessionClaims extends JWTPayload {
  id: string;
  email: string;
  role: string;
  branch: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

let cachedSecretString: string | null = null;
let cachedSecretBytes: Uint8Array | null = null;

function readSecret(): string {
  if (cachedSecretString) return cachedSecretString;
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    // Refuse to start: a short or missing secret makes every protected
    // route trivially forgeable.
    throw new Error(
      "JWT_SECRET is not set or is shorter than 32 characters. " +
        "Generate one with `openssl rand -hex 32` and put it in the environment."
    );
  }
  cachedSecretString = value;
  return value;
}

function readSecretBytes(): Uint8Array {
  if (cachedSecretBytes) return cachedSecretBytes;
  cachedSecretBytes = new TextEncoder().encode(readSecret());
  return cachedSecretBytes;
}

export function signSession(
  claims: Omit<SessionClaims, "iat" | "exp">,
  options: Omit<SignOptions, "expiresIn"> = {}
): string {
  return jwt.sign(claims, readSecret(), {
    ...options,
    expiresIn: SESSION_TTL_SECONDS,
  });
}

/**
 * Verify a session token using jose so the same code path works in both
 * the Node.js runtime (API routes) and the Edge runtime (middleware).
 * Returns null on any failure — callers should treat that as unauthenticated.
 */
export async function verifySession(
  token: string | undefined | null
): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, readSecretBytes());
    if (
      typeof payload.id === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string" &&
      typeof payload.branch === "string"
    ) {
      return payload as SessionClaims;
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "auth_token";
export const SESSION_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
