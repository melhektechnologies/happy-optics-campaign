# Database & authorization

This document explains how the API talks to Supabase, where authorization
actually lives, and what RLS does (and does not) do for us today.

## Tables

| Table                 | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `staff`               | Authenticatable users. `role` ∈ {manager, optometrist, …}; `branch` ∈ {head-office, bole, kera, bethzatha}; `password_hash` is bcrypt; `status` must be `active` to log in. |
| `public_appointments` | Bookings made via the public website. Branch-scoped. The public booking endpoint is the only write path that does not require auth. |
| `patients`            | Patient master record. Auto-created from appointments (best-effort) and managed in the dashboard. Phone is globally unique. |
| `prescriptions`       | Rx records linked to a `patient_id`.                                    |
| `sales`               | POS records, branch-scoped, used by manager analytics.                  |
| `otp_codes`           | Single-use codes for OTP-based login (`/api/auth/verify-otp`).          |

> Note: the appointments-related table is named `public_appointments`, not
> `appointments`. Older docs sometimes use both interchangeably. The code
> reads/writes `public_appointments` everywhere; renaming is deferred to
> avoid a destructive rename in this PR.

## Authorization model

We use the Supabase **service-role key** for all server-side reads and
writes. The service-role key bypasses Row-Level Security entirely, so RLS
is **not** what protects our data in production. What protects our data is:

1. **Every internal API route calls `requireAuth` or `requireRole`
   server-side** (see `lib/auth/server.ts`). The session is the HTTP-only
   `auth_token` cookie set at login.
2. **Branch isolation is enforced in code**, not in the database.
   `branchFilterFor(user)` returns `user.branch` for staff (so the query
   becomes `WHERE branch = $staff.branch`) and `null` for managers (no
   filter). All dashboard routes use this helper before any select.
3. **Manager-only routes (`requireRole(req, "manager")`)** gate writes that
   span all branches: staff creation, paid SMS, analytics, monthly sales
   totals.
4. The middleware (`middleware.ts`) is a *first* line of defense — it
   refuses any non-public route without a valid session — but it does not
   make role decisions. Routes always re-check.

### Why service-role and not Supabase Auth + RLS?

Supabase Auth would be a cleaner long-term model. The bar to migrate is
high because every existing staff account already has a `password_hash`
that doesn't live in Supabase Auth, and there's no SSO. Moving to Auth
would require either (a) a one-shot import that re-hashes each user, or
(b) a parallel auth path during a cutover window.

Until that migration, the **server-side authorization helpers are the
contract**. Any new API route MUST:

1. Call `requireAuth(request)` (or `requireRole(request, "manager")`) and
   bail with the returned response if not authorized.
2. Pass the request body through `parseJsonBody(schema)` for any
   non-trivial POST/PUT.
3. Apply `branchFilterFor(auth.user)` to every query that returns
   branch-scoped rows.

If a route forgets these checks, the service-role key will happily return
or modify *every* branch's data — there is no second line of defense.

## Indexes

Indexes added in `supabase/migrations/20260513_001_indexes_and_constraints.sql`:

- `public_appointments (branch, preferred_date)` — staff listing & today's count
- `public_appointments (created_at DESC)` — admin listing
- `public_appointments (phone)` — patient autocreate lookup
- `sales (branch, sale_date DESC)` — sales reports
- `staff (lower(email))` UNIQUE — login lookup + dedupe
- `staff (branch)` — branch staff listing
- `patients (phone)` UNIQUE — appointment-to-patient join + dedupe
- `prescriptions (patient_id)` — dashboard join
- `prescriptions (prescription_date DESC)` — dashboard ordering

The migration is idempotent (`CREATE INDEX IF NOT EXISTS`). Apply it via
the Supabase dashboard SQL editor or `supabase db push` once the project
is wired to the local CLI.

## Atomic appointment + patient creation

`POST /api/appointments` does two writes:

1. Insert the appointment.
2. (Best-effort) insert a `patients` row if no row exists for the phone.

If step 2 fails we **do not roll back step 1**. Losing a confirmed booking
because a duplicate-phone race occurred would be a worse user experience
than a duplicate patient row. The patient insert error is logged so it can
be reconciled by the manager's "Sync patients" action
(`POST /api/appointments/sync-patients`, manager-only).

For a stricter two-write transaction, move both inserts into a Postgres
function and call it via `supabaseAdmin.rpc(...)`. The
[`pg_temp.book_appointment`](#) RPC is a follow-up that is intentionally
out of scope for this PR.
