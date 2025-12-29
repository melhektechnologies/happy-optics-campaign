# Branch-Specific Login Structure

## 📍 New Login Structure

### Staff Login URLs
Staff members now log in using branch-specific URLs:

- **Head Office:** `/auth/login/head-office`
- **Bole Branch:** `/auth/login/bole`
- **Kera Downtown:** `/auth/login/kera`
- **Betezatha:** `/auth/login/bethzatha`
- **Manager:** `/auth/login/manager`

### Dashboard URLs

- **Manager Dashboard:** `/dashboard/manager`
- **Head Office Dashboard:** `/dashboard/head-office`
- **Bole Dashboard:** `/dashboard/bole`
- **Kera Dashboard:** `/dashboard/kera`
- **Betezatha Dashboard:** `/dashboard/bethzatha`

## 🔒 Security Features

### 1. Branch Validation
- Staff can only log in to their assigned branch
- If staff tries to log in to wrong branch → Error: "You do not have access to this branch"
- Branch is validated at login API level

### 2. Role Validation
- Manager can only log in via `/auth/login/manager`
- Staff cannot log in via manager login
- Role is validated at login API level

### 3. Route Protection
- Staff are automatically redirected to their branch dashboard
- Manager is redirected to `/dashboard/manager`
- Branch mismatch → Auto-redirect to correct branch

### 4. Cross-Branch Protection
- Staff from one branch cannot access another branch's dashboard
- URLs are branch-specific
- Even if they try direct URL, they get redirected

## 📝 How to Add a Test Staff Member

### Step 1: Connect to Supabase Database

Go to your Supabase dashboard → SQL Editor

### Step 2: Run This SQL

```sql
-- Add a test staff member for Head Office branch
INSERT INTO staff (
  full_name,
  email,
  phone,
  branch,
  role,
  position,
  password_hash,
  status,
  hire_date
) VALUES (
  'Test Staff',
  'staff@happyoptics.com',
  '+251911111111',
  'head-office',
  'staff',
  'Receptionist',
  '$2a$10$YourHashedPasswordHere', -- This will be set on first login
  'active',
  CURRENT_DATE
);
```

### Step 3: First Login Password

The password will be set on first login. To set an initial password:

**Option A: Use bcrypt to hash a password**
1. Go to: https://bcrypt-generator.com/
2. Enter your desired password (e.g., `password123`)
3. Copy the hash
4. Update the SQL:

```sql
UPDATE staff 
SET password_hash = '$2a$10$YourHashedPasswordFromBCrypt'
WHERE email = 'staff@happyoptics.com';
```

**Option B: Let them set it on first login**
- Leave `password_hash` as NULL
- Staff will set password on first login

### Step 4: Test Login

1. Go to: `http://localhost:3000/auth/login/head-office`
2. Enter email: `staff@happyoptics.com`
3. Enter password: (the one you set)
4. Should redirect to: `/dashboard/head-office`

## 🧪 Test Staff Accounts by Branch

### Head Office Staff
```
Email: staff@happyoptics.com
Branch: head-office
URL: /auth/login/head-office
Dashboard: /dashboard/head-office
```

### Bole Staff
```
Email: bole.staff@happyoptics.com
Branch: bole
URL: /auth/login/bole
Dashboard: /dashboard/bole
```

### Kera Staff
```
Email: kera.staff@happyoptics.com
Branch: kera
URL: /auth/login/kera
Dashboard: /dashboard/kera
```

### Betezatha Staff
```
Email: bethzatha.staff@happyoptics.com
Branch: bethzatha
URL: /auth/login/bethzatha
Dashboard: /dashboard/bethzatha
```

### Manager
```
Email: manager@happyoptics.com
Branch: (any or null)
Role: manager
URL: /auth/login/manager
Dashboard: /dashboard/manager
```

## 📋 SQL for Multiple Test Staff

```sql
-- Head Office Staff
INSERT INTO staff (full_name, email, phone, branch, role, position, status, hire_date)
VALUES ('Head Office Staff', 'headoffice@happyoptics.com', '+251911111111', 'head-office', 'staff', 'Receptionist', 'active', CURRENT_DATE);

-- Bole Staff
INSERT INTO staff (full_name, email, phone, branch, role, position, status, hire_date)
VALUES ('Bole Staff', 'bole@happyoptics.com', '+251922222222', 'bole', 'staff', 'Optometrist', 'active', CURRENT_DATE);

-- Kera Staff
INSERT INTO staff (full_name, email, phone, branch, role, position, status, hire_date)
VALUES ('Kera Staff', 'kera@happyoptics.com', '+251933333333', 'kera', 'staff', 'Technician', 'active', CURRENT_DATE);

-- Betezatha Staff
INSERT INTO staff (full_name, email, phone, branch, role, position, status, hire_date)
VALUES ('Betezatha Staff', 'bethzatha@happyoptics.com', '+251944444444', 'bethzatha', 'staff', 'Sales Staff', 'active', CURRENT_DATE);
```

## 🔐 Setting Passwords

After creating staff members, set their passwords:

```sql
-- You'll need to hash passwords using bcrypt
-- Use: https://bcrypt-generator.com/ or bcrypt in Node.js

-- Example (replace with actual bcrypt hash):
UPDATE staff 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'headoffice@happyoptics.com';
```

Or let them set on first login (leave password_hash as NULL).

## ✅ Verification

1. ✅ Staff can only log in to their branch URL
2. ✅ Manager can only log in to manager URL
3. ✅ Staff redirected to their branch dashboard
4. ✅ Manager redirected to manager dashboard
5. ✅ Cross-branch access prevented
6. ✅ Branch validation at API level
7. ✅ Route protection in place

## 🚀 Implementation Complete

The new structure is now:
- **Branch-specific login URLs**
- **Branch-specific dashboards**
- **Manager-specific dashboard**
- **Full route protection**
- **Cross-branch security**

