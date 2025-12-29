# Quick Fix: Login "fetch failed" Error

## ❌ Error Message
```
Database error: TypeError: fetch failed. Check if staff table exists.
```

## 🔍 Common Causes

### 1. Staff Table Doesn't Exist
The most common cause - the `staff` table hasn't been created in Supabase.

### 2. Missing Environment Variables
Supabase credentials not set correctly.

### 3. Network/Connection Issue
Cannot reach Supabase server.

## ✅ Solution Steps

### Step 1: Check if Staff Table Exists

Run this in Supabase SQL Editor:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'staff'
) AS table_exists;
```

### Step 2: Create Staff Table (if missing)

If the table doesn't exist, run this SQL:

```sql
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  branch TEXT NOT NULL CHECK (branch IN ('head-office', 'bole', 'kera', 'bethzatha')),
  role TEXT NOT NULL CHECK (role IN ('manager', 'optometrist', 'receptionist', 'technician', 'sales')),
  position TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hire_date DATE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_branch ON staff(branch);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Allow service role access
-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Service role full access" ON staff;
CREATE POLICY "Service role full access"
ON staff FOR ALL
USING (true)
WITH CHECK (true);
```

### Step 3: Verify Environment Variables

Check your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

### Step 4: Restart Dev Server

After creating the table:
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Try logging in again

## 🧪 Test Login

After creating the table, create a test manager:

```sql
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
  'Test Manager',
  'manager@happyoptics.com',
  '+251900000000',
  'head-office',
  'manager',
  'Manager',
  'active',
  CURRENT_DATE
);
```

Then set password (use bcrypt generator):
```sql
UPDATE staff 
SET password_hash = '$2a$10$YourHashedPasswordHere'
WHERE email = 'manager@happyoptics.com';
```

## ✅ Verification

1. ✅ Staff table exists in Supabase
2. ✅ Environment variables set
3. ✅ Dev server restarted
4. ✅ Test manager account created
5. ✅ Try login again

## 📝 Files to Check

- `CHECK-STAFF-TABLE.sql` - SQL to verify/create table
- `CREATE-TEST-STAFF.sql` - SQL to create test accounts
- `.env.local` - Environment variables

**The error should be resolved after creating the staff table!**

