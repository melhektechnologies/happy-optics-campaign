-- SQL Script to Create Test Staff Members
-- Run this in your Supabase SQL Editor

-- Note: Passwords will be set on first login
-- Or you can hash them using bcrypt (see instructions below)

-- ============================================
-- Test Staff for Head Office Branch
-- ============================================
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date
) VALUES (
  'Test Staff - Head Office',
  'staff.headoffice@happyoptics.com',
  '+251911111111',
  'head-office',
  'receptionist',
  'Receptionist',
  'active',
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Test Staff for Bole Branch
-- ============================================
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date
) VALUES (
  'Test Staff - Bole',
  'staff.bole@happyoptics.com',
  '+251922222222',
  'bole',
  'optometrist',
  'Optometrist',
  'active',
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Test Staff for Kera Branch
-- ============================================
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date
) VALUES (
  'Test Staff - Kera',
  'staff.kera@happyoptics.com',
  '+251933333333',
  'kera',
  'technician',
  'Technician',
  'active',
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Test Staff for Betezatha Branch
-- ============================================
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date
) VALUES (
  'Test Staff - Betezatha',
  'staff.bethzatha@happyoptics.com',
  '+251944444444',
  'bethzatha',
  'sales',
  'Sales Staff',
  'active',
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- How to Set Passwords
-- ============================================

-- Option 1: Set password hash directly (use bcrypt generator)
-- Go to: https://bcrypt-generator.com/
-- Enter password (e.g., "password123")
-- Copy the hash
-- Then run:

-- UPDATE staff 
-- SET password_hash = '$2a$10$YourHashedPasswordHere'
-- WHERE email = 'staff.headoffice@happyoptics.com';

-- Option 2: Let staff set password on first login
-- Leave password_hash as NULL - password will be set on first login

-- ============================================
-- Test Manager Account
-- ============================================
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date
) VALUES (
  'Manager Account',
  'manager@happyoptics.com',
  '+251900000000',
  'head-office', -- Manager can be from any branch
  'manager',
  'Manager',
  'active',
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Quick Password Setup (Optional)
-- ============================================
-- To set a simple test password "password123" for all test accounts:
-- (Hash for "password123" using bcrypt with salt rounds 10)

-- UPDATE staff 
-- SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
-- WHERE email IN (
--   'staff.headoffice@happyoptics.com',
--   'staff.bole@happyoptics.com',
--   'staff.kera@happyoptics.com',
--   'staff.bethzatha@happyoptics.com',
--   'manager@happyoptics.com'
-- );

-- ============================================
-- Verification Queries
-- ============================================

-- Check all staff members
-- SELECT id, full_name, email, branch, role, status, created_at 
-- FROM staff 
-- ORDER BY branch, role;

-- Check staff by branch
-- SELECT * FROM staff WHERE branch = 'head-office';

-- Check managers
-- SELECT * FROM staff WHERE role = 'manager';

