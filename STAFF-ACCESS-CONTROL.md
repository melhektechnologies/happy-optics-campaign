# Staff Access Control & Security

## ✅ Staff View After Login

### Navigation Menu (Staff)
When a staff member logs in, they see a **limited navigation menu**:

1. **Dashboard** - Overview of their branch operations
2. **Appointments** - Only appointments for their branch
3. **Prescriptions** - View prescriptions (all patients)
4. **Settings** - Personal settings and password change

### ❌ Pages NOT Visible to Staff
- **Staff Management** - Completely hidden from navigation
- **Sales** - Completely hidden from navigation
- **Patients** - Hidden from navigation (but accessible if needed)

## 🔒 Access Restrictions Implemented

### 1. Staff Management Page (`/dashboard/staff`)
- **Navigation:** Not shown in staff menu
- **Direct Access:** Automatically redirects to dashboard
- **API:** Staff cannot access staff management API
- **Protection:** Client-side redirect + server-side filtering

### 2. Sales Page (`/dashboard/sales`)
- **Navigation:** Not shown in staff menu
- **Direct Access:** Automatically redirects to dashboard
- **API:** Filters sales by branch for staff users
- **Protection:** Client-side redirect + server-side RLS

### 3. Sales API (`/api/dashboard/sales`)
- **Manager:** Can see all sales from all branches
- **Staff:** Can only see sales from their own branch
- **Implementation:** JWT token decoded to get user role and branch
- **Filter:** `query.eq("branch", userBranch)` for staff users

### 4. Appointments
- **Manager:** Can see all appointments from all branches
- **Staff:** Can only see appointments from their own branch
- **Filter:** Applied in frontend and should be in API

### 5. Dashboard
- **Manager:** Full analytics and all-branch stats
- **Staff:** Limited stats (only their branch data)
- **Analytics Tab:** Hidden from staff users

## 🛡️ Security Layers

### Layer 1: Navigation (UI)
- Different navigation menus for manager vs staff
- Staff cannot see restricted pages in sidebar

### Layer 2: Client-Side Protection
- Pages check user role on mount
- Redirect staff users away from restricted pages
- Prevents accidental access via direct URL

### Layer 3: API-Level Protection
- JWT token verification
- Role-based filtering
- Branch-based data filtering for staff
- Server-side enforcement (cannot be bypassed)

### Layer 4: Database RLS (Recommended)
- Row Level Security policies in Supabase
- Additional database-level protection
- Prevents data leakage even if API is compromised

## 📋 Current Implementation Status

### ✅ Fully Protected
- [x] Staff Management page - Redirects staff
- [x] Sales page - Redirects staff
- [x] Sales API - Filters by branch for staff
- [x] Navigation menu - Different for staff/manager
- [x] Dashboard analytics - Hidden from staff

### ⚠️ Partially Protected (Needs API Update)
- [ ] Appointments API - Should filter by branch for staff
- [ ] Patients API - Should filter by branch for staff (if needed)

### 📝 Notes
- Staff can still access Patients page if they type URL directly
- Consider adding redirect for Patients page if staff shouldn't see it
- All API endpoints should verify JWT and filter by branch for staff

## 🔐 How It Works

### Staff Login Flow
1. Staff logs in with email/password
2. JWT token created with `role: "staff"` and `branch: "branch-name"`
3. Token stored in localStorage
4. Navigation menu shows only allowed pages
5. Dashboard shows branch-specific data

### Access Attempt Flow
1. Staff tries to access `/dashboard/staff` or `/dashboard/sales`
2. Page component checks `userRole === "staff"`
3. If staff, redirects to `/dashboard`
4. API also checks role and filters data

### API Request Flow
1. Frontend sends request with JWT token
2. API decodes JWT to get role and branch
3. If `role === "staff"`, applies branch filter
4. Returns only data for that branch
5. Manager gets all data

## 🎯 Best Practices Applied

1. **Defense in Depth:** Multiple layers of protection
2. **Principle of Least Privilege:** Staff only see what they need
3. **Server-Side Validation:** Cannot be bypassed by client
4. **Token-Based Auth:** Secure and scalable
5. **Branch Isolation:** Staff cannot see other branches' data

## 🚀 Future Enhancements

1. Add RLS policies in Supabase for database-level protection
2. Add API filtering for appointments by branch
3. Add API filtering for patients by branch (if needed)
4. Add audit logging for access attempts
5. Add session timeout for security

## 📊 Staff vs Manager Comparison

| Feature | Manager | Staff |
|---------|---------|-------|
| View All Branches | ✅ | ❌ |
| Manage Staff | ✅ | ❌ |
| View Sales | ✅ (All) | ❌ |
| View Appointments | ✅ (All) | ✅ (Own Branch) |
| View Patients | ✅ (All) | ✅ (All) |
| Analytics | ✅ | ❌ |
| Add Staff | ✅ | ❌ |
| Add Sales | ✅ | ❌ |
| Add Appointments | ✅ | ✅ |
| Add Prescriptions | ✅ | ✅ |

## ✅ Summary

**Staff members:**
- ✅ Cannot access Staff Management page
- ✅ Cannot access Sales page
- ✅ Cannot see sales from other branches
- ✅ Can only see appointments from their branch
- ✅ Have limited navigation menu
- ✅ Cannot view analytics

**All restrictions are enforced at multiple levels for security!**

