# 👥 Account Management Guide

## How to Create Accounts

### Initial Setup (First Time)

#### Option 1: Create Manager Account via SQL (Recommended for Initial Setup)

Run this SQL in Supabase SQL Editor:

```sql
-- Create initial manager account
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
  'Your Manager Name',
  'your.manager@email.com',
  '+251-115584293',
  'head-office',
  'manager',
  'Manager',
  'active',
  CURRENT_DATE,
  'your-temporary-password' -- Change this immediately after first login!
) ON CONFLICT (email) DO NOTHING;
```

**After creating the account:**
1. Login with the email and temporary password
2. Go to Settings → Change Password
3. Set a strong, secure password

### After Deployment (Ongoing Account Management)

#### Option 2: Manager Creates Accounts via Dashboard (Recommended)

Once you have a manager account, you can create new staff accounts through the dashboard:

1. **Login as Manager:**
   - Go to `/auth/login`
   - Login with manager credentials
   - Enter OTP code

2. **Navigate to Staff Management:**
   - Click "Staff" in the sidebar
   - Click "Add Staff Member" button

3. **Fill in Staff Details:**
   - Full Name
   - Email (must be unique)
   - Phone
   - Branch (select from dropdown)
   - Role (Manager, Optometrist, Receptionist, Technician, Sales)
   - Position
   - Hire Date

4. **Set Initial Password:**
   - The system will create the account
   - **Important:** The new staff member must:
     - Login with their email
     - Use a temporary password (you'll need to set this)
     - Change password on first login

#### Option 3: Create via API (For Automation)

You can create accounts programmatically via the API:

```typescript
// POST /api/dashboard/staff
{
  "full_name": "John Doe",
  "email": "john.doe@happyoptics.com",
  "phone": "+251911111111",
  "branch": "head-office",
  "role": "optometrist",
  "position": "Senior Optometrist",
  "hire_date": "2024-01-15"
}
```

Then set password via SQL or password reset flow.

## Password Management

### Setting Initial Password

**Method 1: Via SQL (One-time setup)**
```sql
UPDATE staff 
SET password_hash = 'temporary-password-123'
WHERE email = 'staff@email.com';
```

**Method 2: Via Dashboard (After login)**
- Staff member logs in with temporary password
- Goes to Settings → Change Password
- Sets new secure password

### Password Reset Flow (Future Enhancement)

Currently, password reset must be done via SQL:

```sql
-- Reset password for a user
UPDATE staff 
SET password_hash = 'new-temporary-password'
WHERE email = 'user@email.com';
```

**Note:** In production, implement a password reset email flow.

## Account Roles

### Manager
- **Can:** Create/edit/delete staff accounts
- **Can:** View all branches and data
- **Can:** Access analytics and reports
- **Email:** Must be unique
- **Branch:** Usually "head-office"

### Staff Roles
- **Optometrist:** Can view/manage prescriptions
- **Receptionist:** Can manage appointments
- **Technician:** Can manage prescriptions
- **Sales:** Can manage sales records

## Best Practices

1. **Initial Setup:**
   - Create manager account via SQL
   - Login and change password immediately
   - Create other staff accounts via dashboard

2. **Ongoing Management:**
   - Manager creates new accounts via dashboard
   - Set temporary passwords
   - Staff changes password on first login

3. **Security:**
   - Use strong passwords (min 8 characters)
   - Never share passwords
   - Change default passwords immediately
   - Use unique emails for each account

4. **Account Lifecycle:**
   - **Create:** Via dashboard or SQL
   - **Activate:** Set status to "active"
   - **Deactivate:** Set status to "inactive" (preserves data)
   - **Delete:** Remove from database (use with caution)

## Creating Accounts After Deployment

### Step-by-Step Process:

1. **Manager logs in:**
   ```
   URL: /auth/login
   Email: manager@email.com
   Password: [manager password]
   OTP: [check email/console]
   ```

2. **Navigate to Staff page:**
   - Click "Staff" in sidebar
   - Click "Add Staff Member"

3. **Fill form:**
   - Enter all required fields
   - Select branch and role
   - Click "Save"

4. **Set password:**
   - Option A: Use SQL to set temporary password
   - Option B: Implement password reset email (future)

5. **Notify staff:**
   - Send email with login credentials
   - Include temporary password
   - Instruct to change password on first login

## Example: Creating a New Optometrist

```sql
-- Step 1: Create account via dashboard (or SQL)
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
  'Dr. Jane Smith',
  'jane.smith@happyoptics.com',
  '+251933333333',
  'bole',
  'optometrist',
  'Senior Optometrist',
  'active',
  CURRENT_DATE,
  'TempPass123!' -- Temporary password
);

-- Step 2: Staff member logs in and changes password
-- (via Settings → Change Password)
```

## Troubleshooting

### Can't Login?
- Verify email exists in `staff` table
- Check password_hash is set
- Verify role is correct
- Check OTP is received (check console in dev)

### Can't Create Account?
- Verify manager role
- Check email is unique
- Verify all required fields are filled

### Password Not Working?
- Check password_hash in database
- Verify password is correct
- Try resetting via SQL

## Future Enhancements

- [ ] Password reset email flow
- [ ] Bulk account import (CSV)
- [ ] Account activation email
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Two-factor authentication
- [ ] Account expiration dates

