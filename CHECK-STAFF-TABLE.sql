-- Quick Check: Verify Staff Table Exists
-- Run this in Supabase SQL Editor

-- Check if staff table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'staff'
) AS table_exists;

-- If table doesn't exist, create it:
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_branch ON staff(branch);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);

-- Enable RLS (optional, but recommended)
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (since we use service_role_key in API)
-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Service role full access" ON staff;
CREATE POLICY "Service role full access"
ON staff FOR ALL
USING (true)
WITH CHECK (true);

-- Verify table was created
SELECT COUNT(*) as staff_count FROM staff;

