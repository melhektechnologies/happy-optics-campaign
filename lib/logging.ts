/**
 * Safe logging shim.
 *
 * In production we strip values that look like phone numbers, JWTs,
 * one-time codes, and Twilio message bodies from objects/strings before
 * they reach `console`. Development still prints raw values so debugging
 * a reminder flow works as before.
 *
 * This is defense in depth, not a replacement for not logging secrets in
 * the first place. New code should still avoid passing sensitive values
 * to `console.log`.
 */

const IS_PROD = process.env.NODE_ENV === "production";

// Keys whose values we always redact in production. Anything matched is
// replaced with "[redacted]" regardless of nesting depth.
const SENSITIVE_KEYS = new Set<string>([
  "password",
  "password_hash",
  "token",
  "access_token",
  "refresh_token",
  "jwt",
  "authorization",
  "auth_token",
  "otp",
  "otp_code",
  "verification_code",
  "body", // Twilio SMS body
  "phone",
  "phone_number",
  "to",
  "from",
  "email",
]);

// Phone-number-ish strings (Ethiopian + E.164) get masked to "***NNNN".
const PHONE_RE = /(?:\+?\d[\d\s\-().]{6,})/g;
// JWT-shaped strings (three base64url segments separated by dots).
const JWT_RE = /\beyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\b/g;
// Bare 4-8 digit codes (OTP-ish) — only mask when clearly standalone.
const OTP_RE = /\b\d{4,8}\b/g;

function scrubString(s: string): string {
  return s
    .replace(JWT_RE, "[jwt]")
    .replace(PHONE_RE, (m) => {
      const digits = m.replace(/\D/g, "");
      if (digits.length < 7) return m;
      return `[phone:***${digits.slice(-4)}]`;
    })
    .replace(OTP_RE, "[code]");
}

function scrubValue(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[depth-limit]";
  if (value == null) return value;
  if (typeof value === "string") return scrubString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(k.toLowerCase())) {
        out[k] = "[redacted]";
      } else {
        out[k] = scrubValue(v, depth + 1);
      }
    }
    return out;
  }
  return value;
}

function scrubArgs(args: unknown[]): unknown[] {
  if (!IS_PROD) return args;
  return args.map((a) => scrubValue(a));
}

export const safeLog = {
  log: (...args: unknown[]) => console.log(...scrubArgs(args)),
  info: (...args: unknown[]) => console.info(...scrubArgs(args)),
  warn: (...args: unknown[]) => console.warn(...scrubArgs(args)),
  error: (...args: unknown[]) => console.error(...scrubArgs(args)),
};
