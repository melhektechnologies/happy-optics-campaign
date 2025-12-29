-- ============================================
-- Fix public_appointments Table
-- ============================================
-- Run this SQL in Supabase SQL Editor to create/fix the appointments table

-- Drop table if exists (only if you want to recreate it)
-- DROP TABLE IF EXISTS public_appointments CASCADE;

-- Create the public_appointments table with all required columns
CREATE TABLE IF NOT EXISTS public_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,  -- Optional field
  branch TEXT NOT NULL CHECK (branch IN ('head-office', 'bole', 'kera', 'bethzatha')),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  reason TEXT,
  is_unity_student BOOLEAN DEFAULT FALSE,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If table already exists, add missing columns
DO $$ 
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'email'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN email TEXT;
  END IF;

  -- Add reminder_sent if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'reminder_sent'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add reminder_sent_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'reminder_sent_at'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN reminder_sent_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public_appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_branch ON public_appointments(branch);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public_appointments(preferred_date);

-- Disable RLS (since API uses service role key which bypasses RLS anyway)
ALTER TABLE public_appointments DISABLE ROW LEVEL SECURITY;

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'public_appointments'
ORDER BY ordinal_position;

