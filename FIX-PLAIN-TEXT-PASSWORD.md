# Fix: Plain Text Password Issue

## 🔍 Problem Identified

Looking at your CSV file, the manager's password is stored as **plain text** `manager1234` instead of a **bcrypt hash**.

**From CSV:**
- Manager: `password_hash = "manager1234"` ❌ (plain text)
- Bole Branch: `password_hash = "$2b$10$..."` ✅ (bcrypt hash - correct)

The login API uses `bcrypt.compare()` which expects a bcrypt hash, but it's receiving plain text, causing the login to fail.

## ✅ Solutions

### Solution 1: Run SQL to Fix Password Hash (Recommended)

Run this SQL in Supabase SQL Editor:

```sql
-- Fix Manager Password Hash
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
  END as password_status
FROM staff
WHERE email = 'happy.optics.manager@gmail.com';
```

**File:** `FIX-MANAGER-PASSWORD.sql` (ready to use)

### Solution 2: Automatic Fix (Already Implemented)

I've updated the login API to automatically detect and fix plain text passwords:

1. **Detects plain text passwords** (doesn't start with `$2a$`, `$2b$`, or `$2y$`)
2. **Compares directly** if it's plain text
3. **Automatically converts to bcrypt hash** after successful login
4. **Saves the bcrypt hash** to the database

**So you can:**
- Log in with `manager1234` right now (it will work!)
- The system will automatically convert it to a bcrypt hash
- Future logins will use the bcrypt hash

## 🧪 Test Login

After running the SQL (or using automatic fix):

1. Go to: `http://localhost:3001/auth/login/manager`
2. Email: `happy.optics.manager@gmail.com`
3. Password: `manager1234`
4. Click Login

**It should work now!** ✅

## 🔍 Check for Other Plain Text Passwords

Run this SQL to find all staff with plain text passwords:

```sql
-- Find all staff with plain text passwords
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
```

## 🔐 Generate Bcrypt Hash for Any Password

If you need to fix other passwords:

```bash
# In your project terminal
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"
```

Then use the output hash in SQL:

```sql
UPDATE staff 
SET password_hash = '$2b$10$YOUR_GENERATED_HASH_HERE'
WHERE email = 'staff@example.com';
```

## 📝 Summary

**Issue:** Manager password stored as plain text `manager1234` instead of bcrypt hash

**Fix Options:**
1. ✅ Run `FIX-MANAGER-PASSWORD.sql` (immediate fix)
2. ✅ Login with `manager1234` - system will auto-convert (automatic fix)

**Status:**
- ✅ Login API updated to handle plain text passwords
- ✅ SQL script ready to fix the hash
- ✅ Automatic conversion on login implemented

**The login should work now!** 🎉

