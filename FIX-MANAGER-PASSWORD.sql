-- Fix Manager Password Hash
-- The manager password is stored as plain text "manager1234" instead of bcrypt hash
-- This SQL will update it to the correct bcrypt hash

-- Bcrypt hash for "manager1234" (10 rounds)
UPDATE staff 
SET password_hash = '$2b$10$Y3d9igixPO6fN8ehu0kmueyaMOTHwWk.bIhl5qaFLl3UBaH84g0Pi'
WHERE email = 'happy.optics.manager@gmail.com'
  AND (password_hash = 'manager1234' OR password_hash NOT LIKE '$2%');

-- Verify the update
SELECT 
  email,
  full_name,
  role,
  CASE 
    WHEN password_hash IS NULL THEN '❌ No password'
    WHEN password_hash NOT LIKE '$2%' THEN '❌ Plain text (needs fix)'
    ELSE '✅ Bcrypt hash (correct)'
  END as password_status,
  LEFT(password_hash, 20) as hash_preview
FROM staff
WHERE email = 'happy.optics.manager@gmail.com';

-- Also check for any other staff with plain text passwords
SELECT 
  email,
  full_name,
  role,
  password_hash,
  CASE 
    WHEN password_hash IS NULL THEN '❌ No password'
    WHEN password_hash NOT LIKE '$2%' THEN '❌ Plain text (needs fix)'
    ELSE '✅ Bcrypt hash (correct)'
  END as password_status
FROM staff
WHERE password_hash IS NOT NULL 
  AND password_hash NOT LIKE '$2%'
ORDER BY email;

