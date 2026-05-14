import type { NextConfig } from "next";

/**
 * Production security headers.
 *
 * - HSTS: forces HTTPS for one year on the deployed origin (Vercel
 *   terminates TLS for us). We only set this in production so local
 *   `next dev` over http://localhost stays usable.
 * - CSP: report-only for the first rollout. Tightening to enforce mode
 *   is intentionally left as a follow-up so we can observe real-world
 *   violations before blocking. Inline scripts are allowed because Next
 *   injects them; 'self' covers our own bundles.
 * - X-Frame-Options DENY: belt-and-suspenders alongside CSP frame-ancestors.
 * - Referrer-Policy: strict-origin-when-cross-origin keeps the path and
 *   query string out of third-party Referers.
 * - Permissions-Policy: drop access to camera/mic/geo by default; the app
 *   does not use any of those.
 */
const isProd = process.env.NODE_ENV === "production";

const CSP = [
  "default-src 'self'",
  // Next.js inlines small chunks and uses eval in dev. 'unsafe-inline'
  // is unavoidable without nonce wiring; revisit when we move to strict
  // CSP with per-render nonces.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.twilio.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  // Report-only first; flip to enforced after observing reports.
  { key: "Content-Security-Policy-Report-Only", value: CSP },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Cache built images aggressively at the edge. We never re-deploy the
  // same image path with different bytes; rotating an image always changes
  // the path (the file is content-addressed by the team).
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
