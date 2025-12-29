-- ============================================
-- Add Missing Columns to public_appointments
-- ============================================
-- Your table exists but is missing: is_unity_student, notes, updated_at
-- Run this SQL in Supabase SQL Editor

-- Add is_unity_student column
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS is_unity_student BOOLEAN DEFAULT FALSE;

-- Add notes column
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add updated_at column
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Disable RLS (if not already disabled)
ALTER TABLE public_appointments DISABLE ROW LEVEL SECURITY;

-- Verify all columns now exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'public_appointments'
ORDER BY ordinal_position;

-- After running, you should see:
-- id, created_at, full_name, phone, branch, preferred_date, preferred_time, 
-- reason, status, reminder_sent, reminder_sent_at, email, is_unity_student, notes, updated_at
