# Authentication Database Schema

Run these SQL commands in your Supabase SQL Editor to set up authentication.

## 1. Add Password Hash to Staff Table

```sql
-- Add password_hash column to staff table
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
```

## 2. Create OTP Codes Table

```sql
-- Create OTP codes table for email verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_code ON otp_codes(otp_code);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

-- Clean up expired OTPs (optional - can run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes 
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$ LANGUAGE plpgsql;
```

## 3. Create Initial Manager Account

**Important:** After creating the account, login and change the password immediately!

```sql
-- Insert a manager account
-- TEMPORARY PASSWORD: "manager123" (CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!)
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date,
  password_hash
) VALUES (
  'System Manager',
  'happy.optics.manager@gmail.com',
  '+251-115584293',
  'head-office',
  'manager',
  'Manager',
  'active',
  CURRENT_DATE,
  'manager123' -- TEMPORARY - Change password after first login via Settings
) ON CONFLICT (email) DO NOTHING;
```

**After creating the account:**
1. Go to `/auth/login`
2. Login with email: `happy.optics.manager@gmail.com`
3. Password: `manager123`
4. Enter OTP code (check console in development)
5. Go to Settings → Change Password
6. Set a strong, secure password

**For creating accounts after deployment, see `ACCOUNT-MANAGEMENT-GUIDE.md`**

## 4. Create Sample Staff Accounts

```sql
-- Sample staff accounts for testing
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  status,
  hire_date,
  password_hash
) VALUES 
(
  'John Optometrist',
  'john.optometrist@happyoptics.com',
  '+251911111111',
  'head-office',
  'optometrist',
  'Senior Optometrist',
  'active',
  CURRENT_DATE,
  'staff123' -- TEMPORARY - Replace with bcrypt hash
),
(
  'Sarah Receptionist',
  'sarah.receptionist@happyoptics.com',
  '+251922222222',
  'bole',
  'receptionist',
  'Receptionist',
  'active',
  CURRENT_DATE,
  'staff123' -- TEMPORARY - Replace with bcrypt hash
)
ON CONFLICT (email) DO NOTHING;
```

## 5. Row Level Security for OTP Codes

**Note:** Your API uses `supabaseAdmin` (service role key) which **bypasses RLS completely**. Since OTP codes are only accessed via your API (not directly by users), we can disable RLS for this table.

```sql
-- Option 1: Disable RLS (Recommended - since API uses service role)
-- This is safe because:
-- 1. OTP codes are only accessed via your API (service role bypasses RLS anyway)
-- 2. OTP codes expire after 10 minutes
-- 3. OTP codes are marked as used after verification
ALTER TABLE otp_codes DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled (for extra security)
-- Since service role bypasses RLS, these policies only affect direct DB access
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (your API uses service role)
CREATE POLICY "Service role can access otp_codes" 
ON otp_codes FOR ALL 
USING (true);
```

**Recommended:** Use Option 1 (disable RLS) since:
- Your API uses service role key which bypasses RLS anyway
- OTP codes are temporary (expire in 10 minutes)
- Simpler and cleaner
- No security risk since only your API accesses this table

## Security Notes

⚠️ **IMPORTANT**: 
- The password_hash column currently stores plain text passwords (TEMPORARY)
- In production, you MUST use bcrypt to hash passwords
- Never store plain text passwords in production
- Change all default passwords immediately
- Use strong, unique passwords for each account

## Production Password Hashing

**Note:** The code below is TypeScript/JavaScript, NOT SQL. This is for reference only.

In production, use bcrypt in your application code (not in SQL):

```typescript
// This is TypeScript code, NOT SQL!
import bcrypt from "bcryptjs";

// When creating/updating password
const hashedPassword = await bcrypt.hash(password, 10);

// When verifying password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Do NOT run this code in SQL Editor!** This is application code that should be used in your API routes.

## Environment Variables

Add to your `.env.local`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```



