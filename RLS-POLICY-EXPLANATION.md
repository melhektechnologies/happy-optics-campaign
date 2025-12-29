# 🔐 RLS Policy Explanation

## What is Row Level Security (RLS)?

Row Level Security (RLS) is a PostgreSQL/Supabase feature that controls who can access what data in your database tables. It's like a security guard that checks permissions before allowing any database operation.

## Understanding the OTP Codes Policy

```sql
CREATE POLICY "Public can insert otp_codes" 
ON otp_codes FOR INSERT 
WITH CHECK (true);
```

### Breaking it down:

1. **`CREATE POLICY`** - Creates a new security rule
2. **`"Public can insert otp_codes"`** - Name of the policy (for reference)
3. **`ON otp_codes`** - Applies to the `otp_codes` table
4. **`FOR INSERT`** - This policy only applies to INSERT operations (adding new rows)
5. **`WITH CHECK (true)`** - Allows the operation if the condition is true (always true = everyone allowed)

### What it means:

✅ **Anyone (even without login) can INSERT new OTP codes into the database**

### Why is this needed?

When a user tries to login:
1. They enter email and password
2. The system generates an OTP code
3. The system needs to **INSERT** this OTP code into the `otp_codes` table
4. This happens **before** the user is authenticated (they're not logged in yet!)
5. So we need to allow "public" (unauthenticated users) to insert OTP codes

### The Complete OTP Policies:

```sql
-- 1. Public can INSERT (for login flow)
CREATE POLICY "Public can insert otp_codes" 
ON otp_codes FOR INSERT 
WITH CHECK (true);

-- 2. Authenticated staff can SELECT (to verify OTP)
CREATE POLICY "Authenticated staff can view otp_codes" 
ON otp_codes FOR SELECT 
USING (true);

-- 3. Authenticated staff can UPDATE (to mark OTP as used)
CREATE POLICY "Authenticated staff can update otp_codes" 
ON otp_codes FOR UPDATE 
USING (true);
```

### Security Flow:

1. **User tries to login** (not authenticated yet)
   - System generates OTP
   - **Public INSERT policy** allows saving OTP to database ✅

2. **User enters OTP code** (still not authenticated)
   - System needs to check if OTP exists
   - **Authenticated SELECT policy** - Wait, user isn't authenticated yet!
   - ⚠️ **Problem:** This won't work!

### ⚠️ Important Note:

Actually, there's a potential issue here. The OTP verification happens **before** authentication, so the SELECT policy requiring authentication won't work.

**Better approach for OTP codes:**

Since OTP verification happens before authentication, we might need:

```sql
-- Allow public to insert OTP codes (for login)
CREATE POLICY "Public can insert otp_codes" 
ON otp_codes FOR INSERT 
WITH CHECK (true);

-- Allow public to select OTP codes (for verification during login)
CREATE POLICY "Public can select otp_codes" 
ON otp_codes FOR SELECT 
USING (true);

-- Allow authenticated staff to update OTP codes (mark as used)
CREATE POLICY "Authenticated staff can update otp_codes" 
ON otp_codes FOR UPDATE 
USING (true);
```

**OR** use the service role key in your API (which bypasses RLS) for OTP operations.

## Summary

- **`WITH CHECK (true)`** = Always allow this operation
- **`FOR INSERT`** = Only applies when adding new rows
- **"Public"** = Anyone, even without login
- **Purpose:** Allow the login system to save OTP codes before user is authenticated

This policy is necessary because the login flow needs to save OTP codes before the user is logged in!

