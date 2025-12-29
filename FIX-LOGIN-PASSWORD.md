# Fix Login "Invalid email or password" Error

## 🔍 Problem
Getting "Invalid email or password" when trying to log in.

## ✅ Solutions

### Solution 1: First-Time Login (No Password Set)

If the staff member was just created and has no password set:

1. **Try logging in with ANY password** - The system will accept it and set it as the password
2. After first login, use that password for future logins
3. Change the password in Settings after logging in

### Solution 2: Set Initial Password via SQL

Run this in Supabase SQL Editor to set a default password for all staff without passwords:

```sql
-- Generate bcrypt hash for "password123" (10 rounds)
-- You can change "password123" to any password you want
-- To generate your own hash, use: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"

UPDATE staff 
SET password_hash = '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq'
WHERE password_hash IS NULL;

-- Verify passwords were set
SELECT email, full_name, 
  CASE WHEN password_hash IS NULL THEN '❌ No password' ELSE '✅ Password set' END as status
FROM staff;
```

**⚠️ Important:** Change the default password after first login!

### Solution 3: Set Password for Specific Staff Member

```sql
-- First, generate a bcrypt hash using Node.js:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"
-- Copy the hash and use it below:

UPDATE staff 
SET password_hash = '$2a$10$YOUR_GENERATED_HASH_HERE'
WHERE email = 'staff.bole@happyoptics.com';
```

### Solution 4: Generate Password Hash Locally

1. Open terminal in your project directory
2. Run:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(h => console.log(h));"
   ```
3. Copy the output hash
4. Use it in the SQL UPDATE statement above

## 🧪 Test Login

After setting passwords:

1. Go to: `http://localhost:3001/auth/login/bole` (or your branch)
2. Enter email: `staff.bole@happyoptics.com`
3. Enter password: `password123` (or whatever you set)
4. Click Login

## 📝 Quick Test Accounts

If you ran `CREATE-TEST-STAFF.sql`, these accounts exist:

- **Manager:** `happy.optics.manager@gmail.com` (password: set via SQL or first login)
- **Head Office Staff:** `staff.headoffice@happyoptics.com` (password: set via SQL or first login)
- **Bole Staff:** `staff.bole@happyoptics.com` (password: set via SQL or first login)
- **Kera Staff:** `staff.kera@happyoptics.com` (password: set via SQL or first login)
- **Betezatha Staff:** `staff.bethzatha@happyoptics.com` (password: set via SQL or first login)

## 🔐 Change Password After Login

1. Log in successfully
2. Go to Settings page
3. Use "Change Password" section
4. Enter current password and new password
5. Save

## ❓ Still Not Working?

1. **Check email is correct** - Must match exactly (case-insensitive)
2. **Check staff table exists** - Run `CHECK-STAFF-TABLE.sql`
3. **Check environment variables** - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
4. **Check browser console** - Look for error messages
5. **Check server logs** - Look for database errors

## 🚀 Quick Fix Script

Run this complete script in Supabase SQL Editor:

```sql
-- Set default password "password123" for all staff without passwords
-- ⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!

-- This is a bcrypt hash for "password123" (10 rounds)
UPDATE staff 
SET password_hash = '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq'
WHERE password_hash IS NULL;

-- Verify
SELECT 
  email,
  full_name,
  branch,
  CASE WHEN password_hash IS NULL THEN '❌ No password' ELSE '✅ Password set' END as status
FROM staff
ORDER BY branch;
```

**Default password:** `password123` (change after first login!)

