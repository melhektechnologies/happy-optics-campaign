# Fix: Staff Role Check Constraint Error

## ❌ Problem

When trying to insert staff members, you got this error:
```
ERROR: 23514: new row for relation "staff" violates check constraint "staff_role_check"
```

## 🔍 Root Cause

The `staff` table has a check constraint that only allows these roles:
- `'manager'`
- `'optometrist'`
- `'receptionist'`
- `'technician'`
- `'sales'`

**NOT** `'staff'` - this is not a valid role value!

## ✅ Solution Applied

### 1. Fixed SQL Script
Updated `CREATE-TEST-STAFF.sql` to use valid roles:
- Head Office: `'receptionist'` (instead of `'staff'`)
- Bole: `'optometrist'` (instead of `'staff'`)
- Kera: `'technician'` (instead of `'staff'`)
- Betezatha: `'sales'` (instead of `'staff'`)

### 2. Updated Application Code
Changed all checks from `role === "staff"` to `role !== "manager"`:
- This works for all non-manager roles (optometrist, receptionist, technician, sales)
- More flexible and matches database constraints

## 📋 Valid Roles in Database

According to the schema, these are the ONLY allowed roles:

```sql
role TEXT NOT NULL CHECK (role IN (
  'manager',
  'optometrist', 
  'receptionist',
  'technician',
  'sales'
))
```

## 🧪 Updated Test Staff SQL

The SQL now uses correct roles:

```sql
-- Head Office - Receptionist
INSERT INTO staff (..., role, position, ...)
VALUES (..., 'receptionist', 'Receptionist', ...);

-- Bole - Optometrist  
INSERT INTO staff (..., role, position, ...)
VALUES (..., 'optometrist', 'Optometrist', ...);

-- Kera - Technician
INSERT INTO staff (..., role, position, ...)
VALUES (..., 'technician', 'Technician', ...);

-- Betezatha - Sales
INSERT INTO staff (..., role, position, ...)
VALUES (..., 'sales', 'Sales Staff', ...);
```

## ✅ Now You Can Run the SQL

The SQL script will now work! Run it in Supabase SQL Editor:

1. Open `CREATE-TEST-STAFF.sql`
2. Copy the SQL
3. Paste in Supabase SQL Editor
4. Run it
5. ✅ Should work without errors!

## 🔐 Role vs Position

**Important distinction:**
- **`role`** = Database constraint value (manager, optometrist, receptionist, technician, sales)
- **`position`** = Job title/description (can be anything, e.g., "Senior Optometrist", "Receptionist", etc.)

## 📝 Example Staff Records

```sql
-- Receptionist at Head Office
role: 'receptionist'
position: 'Receptionist'

-- Optometrist at Bole
role: 'optometrist'  
position: 'Senior Optometrist'

-- Technician at Kera
role: 'technician'
position: 'Lab Technician'

-- Sales Staff at Betezatha
role: 'sales'
position: 'Sales Associate'
```

## ✅ All Fixed!

- ✅ SQL uses valid roles
- ✅ Application code updated to check `role !== "manager"`
- ✅ Works with all valid role types
- ✅ Ready to create test staff members

**Try running the SQL again - it should work now!** 🎉

