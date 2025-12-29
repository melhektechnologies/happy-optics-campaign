# 🚨 Quick Fix: Appointment Table Error

## The Problem
Error: `Could not find the 'email' column of 'public_appointments' in the schema cache`

This means the table either doesn't exist or is missing the `email` column.

## ✅ Solution: Run This SQL

**Go to Supabase Dashboard → SQL Editor → Run this:**

```sql
-- Create or fix public_appointments table
CREATE TABLE IF NOT EXISTS public_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
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

-- Add missing columns if table exists but is missing them
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'email'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'reminder_sent'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_appointments' AND column_name = 'reminder_sent_at'
  ) THEN
    ALTER TABLE public_appointments ADD COLUMN reminder_sent_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public_appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_branch ON public_appointments(branch);

-- Disable RLS (API uses service role which bypasses RLS anyway)
ALTER TABLE public_appointments DISABLE ROW LEVEL SECURITY;
```

## After Running SQL

1. **Refresh your browser** (clear cache if needed)
2. **Try booking again** at `/book`
3. **Should work now!** ✅

## Verify Table Exists

Run this to check:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'public_appointments'
ORDER BY ordinal_position;
```

You should see all columns including `email`.

## If Still Not Working

1. Check Supabase project is active
2. Verify you're running SQL in the correct project
3. Check `.env.local` has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
4. Restart dev server: `npm run dev`

