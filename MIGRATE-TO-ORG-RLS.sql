-- =====================================================
-- Migration Script: Multi-Organization RLS Implementation
-- =====================================================
-- This script migrates the system to use Supabase Auth
-- with Row Level Security based on org_id
-- =====================================================

-- Step 1: Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  org_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'optometrist', 'receptionist', 'technician', 'sales')),
  branch TEXT CHECK (branch IN ('head-office', 'bole', 'kera', 'bethzatha')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Step 2: Add org_id to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS org_id UUID;

-- Step 3: Add org_id to appointments table (public_appointments)
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS org_id UUID;

-- Step 4: Create organizations table (optional - for multi-tenant support)
-- If you want to track organization details
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Migrate existing data
-- IMPORTANT: You need to manually set org_id for existing records
-- This assumes you have a default organization or will create one

-- Create a default organization (adjust as needed)
INSERT INTO organizations (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Happy Optics Clinic')
ON CONFLICT (id) DO NOTHING;

-- Update existing patients with default org_id (if null)
-- You should manually review and set appropriate org_id
UPDATE patients 
SET org_id = '00000000-0000-0000-0000-000000000001'
WHERE org_id IS NULL;

-- Update existing appointments with default org_id (if null)
UPDATE public_appointments 
SET org_id = '00000000-0000-0000-0000-000000000001'
WHERE org_id IS NULL;

-- Step 6: Make org_id NOT NULL after migration
-- Uncomment these after you've verified all records have org_id:
-- ALTER TABLE patients ALTER COLUMN org_id SET NOT NULL;
-- ALTER TABLE public_appointments ALTER COLUMN org_id SET NOT NULL;

-- Step 7: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_appointments ENABLE ROW LEVEL SECURITY;

-- Step 8: Drop existing RLS policies (if they exist)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "patients_select_org" ON patients;
DROP POLICY IF EXISTS "patients_insert_org" ON patients;
DROP POLICY IF EXISTS "patients_update_org" ON patients;
DROP POLICY IF EXISTS "patients_delete_org" ON patients;
DROP POLICY IF EXISTS "appointments_select_org" ON public_appointments;
DROP POLICY IF EXISTS "appointments_insert_org" ON public_appointments;
DROP POLICY IF EXISTS "appointments_update_org" ON public_appointments;
DROP POLICY IF EXISTS "appointments_delete_org" ON public_appointments;

-- Step 9: Create new RLS policies for profiles
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
USING (id = auth.uid());

-- Step 10: Create new RLS policies for patients
CREATE POLICY "patients_select_org"
ON patients
FOR SELECT
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "patients_insert_org"
ON patients
FOR INSERT
WITH CHECK (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "patients_update_org"
ON patients
FOR UPDATE
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "patients_delete_org"
ON patients
FOR DELETE
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

-- Step 11: Create new RLS policies for appointments
CREATE POLICY "appointments_select_org"
ON public_appointments
FOR SELECT
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "appointments_insert_org"
ON public_appointments
FOR INSERT
WITH CHECK (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "appointments_update_org"
ON public_appointments
FOR UPDATE
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "appointments_delete_org"
ON public_appointments
FOR DELETE
USING (
  org_id = (
    SELECT org_id FROM profiles WHERE id = auth.uid()
  )
);

-- Step 12: Create function to automatically set org_id on insert
-- This ensures org_id is always set correctly
CREATE OR REPLACE FUNCTION set_org_id_from_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.org_id IS NULL THEN
    NEW.org_id := (SELECT org_id FROM profiles WHERE id = auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS set_patients_org_id ON patients;
CREATE TRIGGER set_patients_org_id
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_org_id_from_profile();

DROP TRIGGER IF EXISTS set_appointments_org_id ON public_appointments;
CREATE TRIGGER set_appointments_org_id
  BEFORE INSERT ON public_appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_org_id_from_profile();

-- =====================================================
-- IMPORTANT NOTES:
-- =====================================================
-- 1. This migration requires Supabase Auth to be enabled
-- 2. You must migrate existing staff to Supabase Auth users
-- 3. You must create profile records for each user
-- 4. You must set org_id for all existing data
-- 5. The application code must be updated to use Supabase Auth
--    instead of JWT tokens
-- =====================================================

