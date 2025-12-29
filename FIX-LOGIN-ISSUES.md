# 🔧 Fix Login Issues

## Problem
Login is not working. The user wants to remove public access requirement for OTP codes.

## Solution

Since your API uses `supabaseAdmin` (service role key) which **bypasses RLS completely**, we can simplify the RLS setup.

## Updated SQL (Run This)

```sql
-- Disable RLS for otp_codes table
-- This is safe because:
-- 1. Your API uses service role key (bypasses RLS anyway)
-- 2. OTP codes are only accessed via your API
-- 3. OTP codes expire after 10 minutes
-- 4. OTP codes are marked as used after verification
ALTER TABLE otp_codes DISABLE ROW LEVEL SECURITY;
```

**That's it!** No need for complex policies since your API bypasses RLS anyway.

## Why This Works

1. **Your API uses service role key:**
   ```typescript
   // lib/supabase/server.ts
   export const supabaseAdmin = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY, // ← This bypasses RLS
   );
   ```

2. **Service role key = Full access:**
   - Can read/write/delete anything
   - Bypasses all RLS policies
   - No need for public access policies

3. **OTP codes are temporary:**
   - Expire in 10 minutes
   - Marked as used after verification
   - Only accessed via your API

## Troubleshooting Login

### Check These:

1. **OTP not being saved?**
   - Check browser console for errors
   - Check server logs for API errors
   - Verify `otp_codes` table exists

2. **"Invalid credentials" error?**
   - Verify email exists in `staff` table
   - Check `password_hash` is set correctly
   - Verify password matches (currently plain text)

3. **"Invalid or expired OTP" error?**
   - Check OTP code in console (development)
   - Verify OTP hasn't expired (10 minutes)
   - Check OTP hasn't been used already

4. **Database errors?**
   - Verify `otp_codes` table exists
   - Check RLS is disabled (run SQL above)
   - Verify service role key is correct

### Debug Steps:

1. **Check server logs:**
   ```bash
   # Look for console.log output
   # OTP code should be printed: "OTP for email@example.com: 123456"
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for network errors
   - Check API responses

3. **Test API directly:**
   ```bash
   # Test login endpoint
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"happy.optics.manager@gmail.com","password":"manager123"}'
   ```

4. **Verify database:**
   ```sql
   -- Check if staff exists
   SELECT * FROM staff WHERE email = 'happy.optics.manager@gmail.com';
   
   -- Check if OTP was created
   SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 5;
   ```

## Common Issues

### Issue 1: Table doesn't exist
**Error:** `relation "otp_codes" does not exist`

**Fix:** Run the SQL from `DATABASE-AUTH-SCHEMA.md` section 2 to create the table.

### Issue 2: RLS blocking access
**Error:** `new row violates row-level security policy`

**Fix:** Run the SQL above to disable RLS for `otp_codes`.

### Issue 3: Service role key missing
**Error:** `Missing SUPABASE_SERVICE_ROLE_KEY`

**Fix:** Add to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Issue 4: Password doesn't match
**Error:** `Invalid email or password`

**Fix:** 
- Check password in database: `SELECT password_hash FROM staff WHERE email = '...'`
- Verify password matches exactly (currently plain text)

## Quick Fix Checklist

- [ ] Run SQL to disable RLS: `ALTER TABLE otp_codes DISABLE ROW LEVEL SECURITY;`
- [ ] Verify `otp_codes` table exists
- [ ] Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Verify staff account exists with correct password
- [ ] Check browser console for errors
- [ ] Check server logs for OTP code
- [ ] Test login flow

## After Fixing

Once RLS is disabled, the login should work because:
1. API uses service role (bypasses RLS anyway)
2. No RLS blocking = simpler setup
3. OTP codes can be saved/read without issues

Try logging in again! 🚀

