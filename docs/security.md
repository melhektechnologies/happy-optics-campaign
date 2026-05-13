# Security model

This document captures the security controls in place and the explicitly
accepted exceptions. It is the source of truth for the audit acceptance
criteria for Phases 2-6.

## Authentication

- The session is the HTTP-only `auth_token` cookie set at login. It is the
  **only** source of truth for client identity; no token is returned in
  the response body, and no role/branch is read from `localStorage`.
- `JWT_SECRET` is required at module load. Missing or shorter than 32
  characters → the auth path refuses to start. There are no fallback
  secrets in the codebase.
- Cookie attributes: `HttpOnly`, `SameSite=Lax`, `Secure` in production,
  `Path=/`, `Max-Age=604800` (7 days).
- Identity lookups for the client go through `GET /api/auth/me`, which
  re-reads the DB and signs out deactivated users.

## Authorization

Every internal API route calls `requireAuth` or `requireRole` server-side.
Middleware is a first line of defense but does not make role decisions.

| Surface                              | Who can call it                          |
| ------------------------------------ | ---------------------------------------- |
| `POST /api/appointments`             | Public (rate-limited)                    |
| `POST /api/contact`                  | Public (rate-limited)                    |
| `POST /api/appointments/reminder`    | Manager only; phone & date loaded from DB |
| `POST /api/appointments/sync-patients` | Manager only                          |
| `POST /api/dashboard/staff`          | Manager only                             |
| `GET/POST /api/dashboard/sales`      | Manager (any branch) / staff (own branch) |
| `GET /api/analytics`                 | Manager only                             |
| All other `/api/dashboard/*`         | Authenticated; branch-isolated by helper |

Branch isolation is enforced via `branchFilterFor(user)` in
`lib/auth/server.ts`. Service-role bypasses RLS, so this helper is the
contract — see [`docs/database.md`](./database.md) for the full model.

## CSRF / same-site mutation protection

- `SameSite=Lax` on the session cookie blocks cross-site form submissions.
- Middleware additionally rejects any mutating method (`POST/PUT/PATCH/DELETE`)
  whose `Origin` (or fallback `Referer`) does not match the request's
  `Host`. Same-origin POSTs pass; cross-origin / null-origin requests get
  HTTP 403 `csrf_blocked`. This covers the [GHSA-mq59-m269-xvcx](https://github.com/advisories/GHSA-mq59-m269-xvcx)
  null-origin CSRF class without depending on the Server Actions framework.

## Rate limiting

In-memory per-IP buckets via `lib/api/rate-limit.ts`:

| Endpoint                  | Window | Max |
| ------------------------- | ------ | --- |
| `POST /api/appointments`  | 1 hour | 5   |
| `POST /api/contact`       | 1 hour | 5   |

The buckets are process-local. Move to Redis/Upstash before running
multiple Next.js instances behind a load balancer.

## Production security headers

Set in `next.config.ts`:

- **Strict-Transport-Security** `max-age=31536000; includeSubDomains; preload`
  (production only — `next dev` over localhost still works).
- **Content-Security-Policy-Report-Only** with `default-src 'self'`,
  `connect-src` allow-listing Supabase + Twilio, `frame-ancestors 'none'`,
  `object-src 'none'`, `form-action 'self'`. **Report-only for the first
  rollout** — flip to enforced after observing CSP violation reports.
- **X-Frame-Options** `DENY`
- **X-Content-Type-Options** `nosniff`
- **Referrer-Policy** `strict-origin-when-cross-origin`
- **Permissions-Policy** drops camera / mic / geolocation / Topics /
  interest cohort.

## Logging

Production routes use `safeLog` from `lib/logging.ts` for any path that
might touch sensitive fields. In production, `safeLog` recursively scrubs
phone numbers, JWT-shaped strings, 4-8 digit codes, and any object keys
matching `password`, `token`, `otp`, `body`, `phone`, `to`, `from`,
`email`, etc. In development, raw values are still printed so debugging
the SMS path stays usable.

OTP codes and SMS bodies are never written to the DB or echoed in
responses.

## Dependency vulnerabilities

`npm audit` was reduced from 10 vulnerabilities (5 high, 5 moderate) to
**1 moderate**:

| Status        | Count | Notes |
| ------------- | ----- | ----- |
| High severity | 0     | Patched. Next.js 16.1.1 → 16.2.6 cleared 15+ CVEs including [middleware/proxy bypass](https://github.com/advisories/GHSA-492v-c6pp-mqqv) and [null-origin Server Actions CSRF bypass](https://github.com/advisories/GHSA-mq59-m269-xvcx). |
| Moderate (1)  | postcss `<8.5.10` transitively pinned inside Next.js 16.2.6 itself. `npm audit`'s only suggested fix is to downgrade Next.js to 9.x, which is absurd. The CVE is a CSS-stringification XSS that affects user-controlled CSS, which our app does not emit. Accepted; will clear automatically on the next Next.js patch release. |

Run `npm audit` to verify current status.

## Documentation hygiene

The repository previously contained 40+ development-iteration markdown
files at the root (working notes, debug runbooks) — some of which
suggested setting plain-text passwords like `password123` and
`manager1234`. These were removed in the Phase 5-6 PR. Production docs
live under `docs/` plus the root `README.md`, `JWT-SECRET-GUIDE.md`,
`ENV-SETUP-GUIDE.md`, `DATABASE-SCHEMA.md`, and `README-DEPLOY.md`.

## Out of scope (deferred)

- **Real chat provider integration.** The fake chat widget was removed in
  Phase 5; a real integration (Intercom / Crisp / WhatsApp Business) is
  product work that needs vendor selection first.
- **Prescription file uploads.** The orphan `PrescriptionUpload`
  component was removed. Implementing it correctly requires Supabase
  Storage, MIME sniffing, size limits, virus scanning, and signed-URL
  reads — out of scope for the audit phase.
- **Supabase Auth + RLS migration.** See [`docs/database.md`](./database.md#why-service-role-and-not-supabase-auth--rls).
- **CSP enforce mode.** Currently report-only; promote after observing
  real-world violation reports.
