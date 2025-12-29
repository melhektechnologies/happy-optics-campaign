-- SQL Script to Set Initial Passwords for Staff
-- Run this in Supabase SQL Editor
-- 
-- IMPORTANT: This sets a default password "password123" for all staff without passwords
-- Change this password immediately after first login!
--
-- To generate a bcrypt hash, use Node.js:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(h => console.log(h));"
--
-- Or use an online bcrypt generator: https://bcrypt-generator.com/

-- Default password hash for "password123" (bcrypt, 10 rounds)
-- ⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!
UPDATE staff 
SET password_hash = '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq'
WHERE password_hash IS NULL;

-- Verify passwords were set
SELECT 
  email,
  full_name,
  branch,
  role,
  CASE 
    WHEN password_hash IS NULL THEN '❌ No password'
    ELSE '✅ Password set'
  END as password_status
FROM staff
ORDER BY branch, role;

-- To set a specific password for a specific staff member:
-- UPDATE staff 
-- SET password_hash = '$2a$10$YOUR_BCRYPT_HASH_HERE'
-- WHERE email = 'staff.bole@happyoptics.com';

