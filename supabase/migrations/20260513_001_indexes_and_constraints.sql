-- Production-readiness indexes.
--
-- Every dashboard query today is filtered by some combination of branch +
-- date or phone, but none of those columns are indexed. On any non-trivial
-- data volume that means full table scans for every page load.
--
-- This migration is additive and idempotent — `CREATE INDEX IF NOT EXISTS`
-- and `CREATE UNIQUE INDEX IF NOT EXISTS` mean re-running it is safe.

-- ============================================================
-- public_appointments
-- ============================================================
-- /api/appointments and /api/dashboard/appointments/today filter by
-- (branch, preferred_date). The chronological list views order by
-- created_at DESC.
CREATE INDEX IF NOT EXISTS idx_public_appointments_branch_date
  ON public_appointments (branch, preferred_date);

CREATE INDEX IF NOT EXISTS idx_public_appointments_created_at
  ON public_appointments (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_public_appointments_phone
  ON public_appointments (phone);

-- ============================================================
-- sales
-- ============================================================
-- /api/dashboard/sales filters by (branch, sale_date) with various ranges
-- and orders DESC by sale_date.
CREATE INDEX IF NOT EXISTS idx_sales_branch_sale_date
  ON sales (branch, sale_date DESC);

-- ============================================================
-- staff
-- ============================================================
-- Login does a single equality lookup on email; staff listing filters by
-- branch. Email must also be globally unique to prevent two accounts with
-- the same address (we lowercase server-side before comparing).
CREATE UNIQUE INDEX IF NOT EXISTS idx_staff_email_unique
  ON staff (lower(email));

CREATE INDEX IF NOT EXISTS idx_staff_branch
  ON staff (branch);

-- ============================================================
-- patients
-- ============================================================
-- /api/appointments autocreates a patient by phone; the lookup must be
-- O(log n), and we want at most one patient per phone number.
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_phone_unique
  ON patients (phone);

-- ============================================================
-- prescriptions
-- ============================================================
-- Dashboard listing orders by prescription_date DESC and joins by
-- patient_id.
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id
  ON prescriptions (patient_id);

CREATE INDEX IF NOT EXISTS idx_prescriptions_prescription_date
  ON prescriptions (prescription_date DESC);
