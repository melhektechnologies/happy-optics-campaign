# Row Level Security (RLS) Migration Guide

## Current System vs. Requested System

### Current System
- ✅ Uses JWT tokens for authentication
- ✅ Uses `staff` table with `branch` field
- ✅ Data filtering in application code
- ✅ Uses service role key (bypasses RLS)
- ❌ No database-level data isolation

### Requested System
- ✅ Uses Supabase Auth (`auth.uid()`)
- ✅ Uses `profiles` table with `org_id`
- ✅ RLS enforces data isolation at database level
- ✅ Users can only access their organization's data

## Migration Steps

### Step 1: Run the Migration SQL

Run `MIGRATE-TO-ORG-RLS.sql` in your Supabase SQL Editor. This will:
1. Create `profiles` table
2. Add `org_id` to `patients` and `appointments` tables
3. Create `organizations` table (optional)
4. Enable RLS and create policies
5. Create triggers to auto-set `org_id`

### Step 2: Enable Supabase Auth

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable Email/Password authentication
3. Configure email templates if needed

### Step 3: Migrate Existing Users

You need to:
1. Create Supabase Auth users for each staff member
2. Create profile records linking auth users to staff data
3. Set `org_id` for each profile

**SQL Script to Migrate Staff to Profiles:**

```sql
-- This assumes you have staff table with email/password
-- You'll need to create Supabase Auth users first, then run this

-- Example: Create profile for a staff member
-- Replace 'auth-user-id' with actual Supabase Auth user ID
-- Replace 'org-id' with your organization ID

INSERT INTO profiles (id, email, full_name, org_id, role, branch)
SELECT 
  'auth-user-id'::uuid,  -- From Supabase Auth
  email,
  full_name,
  '00000000-0000-0000-0000-000000000001'::uuid,  -- Your org_id
  role,
  branch
FROM staff
WHERE email = 'staff@example.com';
```

### Step 4: Update Application Code

The application needs significant changes:

#### 4.1 Update Authentication

**Current:** JWT tokens in cookies
**New:** Supabase Auth client

**File: `lib/supabase/client.ts` (NEW)**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**File: `app/api/auth/login/route.ts` (UPDATE)**
```typescript
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  // Use Supabase Auth instead of JWT
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  
  // Return session
  return NextResponse.json({ user: data.user, session: data.session });
}
```

#### 4.2 Update API Routes

**Current:** Uses `supabaseAdmin` (service role, bypasses RLS)
**New:** Use Supabase client with user session (RLS enforced)

**File: `app/api/dashboard/patients/route.ts` (UPDATE)**
```typescript
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Get session from cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Create Supabase client with user's access token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
  
  // RLS will automatically filter by org_id
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

#### 4.3 Update Client Components

**File: `app/dashboard/appointments/page.tsx` (UPDATE)**
```typescript
'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const fetchAppointments = async () => {
    // RLS automatically filters by org_id
    const { data, error } = await supabase
      .from('public_appointments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    setAppointments(data || []);
  };
  
  // ... rest of component
}
```

### Step 5: Public Appointment Booking

For public appointment booking (no auth required), you have two options:

**Option A: Use Service Role (Current Approach)**
- Keep using `supabaseAdmin` for public booking
- Manually set `org_id` based on branch selection
- RLS won't apply (service role bypasses RLS)

**Option B: Create Anonymous User**
- Create a temporary anonymous Supabase Auth user
- Use that session for the booking
- RLS will apply, but you need to handle `org_id` mapping

**Recommended: Option A for public booking**

```typescript
// app/api/appointments/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Map branch to org_id (you'll need a mapping table)
  const branchToOrgId: Record<string, string> = {
    'head-office': '00000000-0000-0000-0000-000000000001',
    'bole': '00000000-0000-0000-0000-000000000001',
    // ... etc
  };
  
  const { data, error } = await supabaseAdmin
    .from('public_appointments')
    .insert({
      ...body,
      org_id: branchToOrgId[body.branch],
    });
  
  // ...
}
```

## Testing Checklist

- [ ] Run migration SQL successfully
- [ ] Create test Supabase Auth users
- [ ] Create profile records for test users
- [ ] Test RLS policies:
  - [ ] User can only see their own profile
  - [ ] User can only see patients from their org
  - [ ] User can only see appointments from their org
  - [ ] User cannot access other orgs' data
- [ ] Update authentication flow
- [ ] Update all API routes
- [ ] Update client components
- [ ] Test public appointment booking
- [ ] Verify data isolation works correctly

## Important Considerations

1. **Breaking Change:** This is a major architectural change. The application will need significant updates.

2. **Data Migration:** You must manually set `org_id` for all existing records.

3. **User Migration:** Each staff member needs a Supabase Auth account and profile record.

4. **Public Booking:** Public appointment booking will need special handling since there's no authenticated user.

5. **Backward Compatibility:** The current JWT-based system will stop working after migration.

## Alternative: Hybrid Approach

If you want to keep the current system but add RLS:

1. Keep JWT authentication
2. Use `staff.branch` as `org_id` equivalent
3. Create RLS policies based on `branch` instead of `org_id`
4. Use Supabase client with service role but add manual filtering

This would require less code changes but provides less security (no database-level enforcement).

## Need Help?

If you need assistance with the migration, consider:
1. Testing in a development environment first
2. Creating a backup of your database
3. Migrating one feature at a time
4. Keeping the old system running in parallel during migration

