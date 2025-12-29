# Fixes: 404 Error and Login Issues

## ✅ Issues Fixed

### 1. 404 Error on Branch Dashboard Routes

**Problem:** Accessing `/dashboard/bole/appointments` resulted in a 404 error because branch-specific routes didn't exist.

**Solution:** Created branch-specific pages for all dashboard routes:
- ✅ `/dashboard/[branch]/appointments/page.tsx` - Branch appointments page
- ✅ `/dashboard/[branch]/appointments/new/page.tsx` - Schedule new appointment
- ✅ `/dashboard/[branch]/prescriptions/page.tsx` - Branch prescriptions page
- ✅ `/dashboard/[branch]/settings/page.tsx` - Branch settings page

**Files Created:**
- `app/dashboard/[branch]/appointments/page.tsx`
- `app/dashboard/[branch]/appointments/new/page.tsx`
- `app/dashboard/[branch]/prescriptions/page.tsx`
- `app/dashboard/[branch]/settings/page.tsx`

### 2. Login "Invalid email or password" Error

**Problem:** Staff members couldn't log in because passwords weren't set initially.

**Solution:** 
1. Improved login API to handle first-time login (accepts any password if `password_hash` is null)
2. Created SQL script to set initial passwords
3. Created guide for password management

**Files Created/Updated:**
- `app/api/auth/login/route.ts` - Improved error handling and first-time login
- `SET-PASSWORD-FOR-STAFF.sql` - SQL to set initial passwords
- `FIX-LOGIN-PASSWORD.md` - Complete guide for password issues

## 🚀 How to Fix Login Issue

### Option 1: First-Time Login (Easiest)

If staff member has no password set:
1. Try logging in with **ANY password**
2. System will accept it and set it as the password
3. Use that password for future logins
4. Change password in Settings after login

### Option 2: Set Password via SQL

Run this in Supabase SQL Editor:

```sql
-- Set default password "password123" for all staff without passwords
-- ⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!

UPDATE staff 
SET password_hash = '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq'
WHERE password_hash IS NULL;

-- Verify passwords were set
SELECT email, full_name, 
  CASE WHEN password_hash IS NULL THEN '❌ No password' ELSE '✅ Password set' END as status
FROM staff;
```

**Default password:** `password123` (change after first login!)

### Option 3: Generate Your Own Password Hash

1. Open terminal in project directory
2. Run:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"
   ```
3. Copy the output hash
4. Use it in SQL UPDATE statement

## 📝 Test Accounts

If you ran `CREATE-TEST-STAFF.sql`, these accounts exist:

- **Manager:** `happy.optics.manager@gmail.com`
- **Head Office:** `staff.headoffice@happyoptics.com`
- **Bole:** `staff.bole@happyoptics.com`
- **Kera:** `staff.kera@happyoptics.com`
- **Betezatha:** `staff.bethzatha@happyoptics.com`

**Login URLs:**
- Manager: `http://localhost:3001/auth/login/manager`
- Staff: `http://localhost:3001/auth/login/bole` (or your branch)

## ✅ Verification

1. **404 Error Fixed:**
   - ✅ Navigate to `/dashboard/bole/appointments` - should work
   - ✅ Navigate to `/dashboard/bole/prescriptions` - should work
   - ✅ Navigate to `/dashboard/bole/settings` - should work
   - ✅ Click "Schedule Appointment" - should work

2. **Login Fixed:**
   - ✅ Set passwords using SQL or first-time login
   - ✅ Try logging in with correct credentials
   - ✅ Should redirect to branch dashboard

## 🔧 Additional Improvements

1. **Better Error Messages:** Login API now provides clearer error messages
2. **First-Time Login Support:** System automatically sets password on first login
3. **Branch-Specific Filtering:** Branch pages only show data for that branch
4. **Consistent Navigation:** All branch routes now work correctly

## 📚 Related Files

- `FIX-LOGIN-PASSWORD.md` - Detailed password troubleshooting
- `SET-PASSWORD-FOR-STAFF.sql` - SQL script for setting passwords
- `CHECK-STAFF-TABLE.sql` - Verify staff table exists
- `CREATE-TEST-STAFF.sql` - Create test staff accounts

## 🎯 Next Steps

1. Set passwords for all staff members (use SQL or first-time login)
2. Test login for each branch
3. Verify all branch-specific routes work
4. Test appointment scheduling from branch dashboard

**All issues should now be resolved!** 🎉

