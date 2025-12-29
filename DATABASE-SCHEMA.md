# Database Schema for Management System

Run these SQL commands in your Supabase SQL Editor to create all necessary tables.

## 1. Staff Table

```sql
-- Create staff table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_branch ON staff(branch);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
```

## 2. Patients Table

```sql
-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  last_visit DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
```

## 3. Prescriptions Table

```sql
-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescription_date DATE NOT NULL,
  right_eye_sphere TEXT,
  right_eye_cylinder TEXT,
  right_eye_axis TEXT,
  left_eye_sphere TEXT,
  left_eye_cylinder TEXT,
  left_eye_axis TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_date ON prescriptions(prescription_date);
```

## 4. Sales Table

```sql
-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  sale_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  items TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'mobile', 'other')),
  branch TEXT NOT NULL CHECK (branch IN ('head-office', 'bole', 'kera', 'bethzatha')),
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_branch ON sales(branch);
CREATE INDEX IF NOT EXISTS idx_sales_patient ON sales(patient_id);
```

## 5. Update Appointments Table (if needed)

```sql
-- Add reminder columns if not exists
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE;
```

## 6. Create Views for Dashboard Stats

```sql
-- View for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM patients) as total_patients,
  (SELECT COUNT(*) FROM public_appointments WHERE preferred_date = CURRENT_DATE) as today_appointments,
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE sale_date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_sales;
```

## 7. Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Staff table: Only authenticated staff can view/manage
CREATE POLICY "Authenticated staff can view all staff" 
ON staff FOR SELECT 
USING (true);

CREATE POLICY "Authenticated staff can insert staff" 
ON staff FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update staff" 
ON staff FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated staff can delete staff" 
ON staff FOR DELETE 
USING (true);

-- Patients table: Public can insert (for appointments), authenticated staff can view/manage
CREATE POLICY "Public can insert patients" 
ON patients FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated staff can view all patients" 
ON patients FOR SELECT 
USING (true);

CREATE POLICY "Authenticated staff can update patients" 
ON patients FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated staff can delete patients" 
ON patients FOR DELETE 
USING (true);

-- Prescriptions table: Authenticated staff can view/manage
CREATE POLICY "Authenticated staff can view all prescriptions" 
ON prescriptions FOR SELECT 
USING (true);

CREATE POLICY "Authenticated staff can insert prescriptions" 
ON prescriptions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update prescriptions" 
ON prescriptions FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated staff can delete prescriptions" 
ON prescriptions FOR DELETE 
USING (true);

-- Sales table: Authenticated staff can view/manage
CREATE POLICY "Authenticated staff can view all sales" 
ON sales FOR SELECT 
USING (true);

CREATE POLICY "Authenticated staff can insert sales" 
ON sales FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated staff can update sales" 
ON sales FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated staff can delete sales" 
ON sales FOR DELETE 
USING (true);
```

## Notes

- All tables use UUIDs for primary keys
- Timestamps are automatically managed
- Foreign keys ensure data integrity
- Indexes improve query performance
- RLS policies can be customized based on your authentication setup

