# ✅ Complete System Verification Checklist

## 🔐 Authentication System

### Login Flow
- [ ] Go to `/auth/login`
- [ ] Enter email: `happy.optics.manager@gmail.com`
- [ ] Enter password: `manager123`
- [ ] Click "Login"
- [ ] Should redirect to `/dashboard` immediately
- [ ] No OTP step required

### Password Change
- [ ] Login as manager
- [ ] Go to `/dashboard/settings`
- [ ] Scroll to "Change Password" section
- [ ] Enter current password
- [ ] Enter new password (min 8 chars)
- [ ] Confirm new password
- [ ] Click "Change Password"
- [ ] Should see success message

## 📅 Appointment Booking (MAIN FEATURE)

### Public Booking Form
- [ ] Go to `/book`
- [ ] Fill in all required fields:
  - [ ] Full Name
  - [ ] Phone Number
  - [ ] Email (optional)
  - [ ] Preferred Branch (dropdown works)
  - [ ] Preferred Date (date picker works, must be tomorrow+)
  - [ ] Preferred Time (dropdown works)
  - [ ] Reason (optional dropdown)
  - [ ] Unity Student checkbox
  - [ ] Notes (optional)
- [ ] Click "Submit Appointment Request"
- [ ] Should see success message
- [ ] Should redirect to success page

### Verify in Database
```sql
-- Check if appointment was saved
SELECT * FROM public_appointments 
ORDER BY created_at DESC 
LIMIT 5;
```

### Dashboard View
- [ ] Login as manager
- [ ] Go to `/dashboard/appointments`
- [ ] Should see the new appointment in the list
- [ ] Check all appointment details are correct
- [ ] Test filters (All, Today, Upcoming, Unity, Past)
- [ ] Test search functionality

## 👥 Staff Management

### Manager Access
- [ ] Login as manager
- [ ] Go to `/dashboard/staff`
- [ ] Should see "Add Staff Member" button
- [ ] Click "Add Staff Member"
- [ ] Fill in form:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone
  - [ ] Branch
  - [ ] Role
  - [ ] Position
- [ ] Save
- [ ] Should see new staff in list

### Staff Access
- [ ] Login as staff member
- [ ] Go to `/dashboard/staff`
- [ ] Should NOT see "Add Staff Member" button
- [ ] Should only see staff from their branch

## 📊 Dashboard Features

### Manager Dashboard
- [ ] Login as manager
- [ ] Go to `/dashboard`
- [ ] Should see:
  - [ ] Total Patients card
  - [ ] Today Appointments card
  - [ ] Monthly Sales card
  - [ ] Website Visits card (manager only)
  - [ ] Unique Visitors card (manager only)
  - [ ] Page Views card (manager only)
  - [ ] Conversion Rate card (manager only)
- [ ] Click "Analytics" tab
- [ ] Should see charts:
  - [ ] Appointments by Branch (pie chart)
  - [ ] Appointments Trend (line chart)
  - [ ] Top Pages list

### Staff Dashboard
- [ ] Login as staff member
- [ ] Go to `/dashboard`
- [ ] Should see:
  - [ ] Total Patients card
  - [ ] Today Appointments card
  - [ ] Monthly Sales card
- [ ] Should NOT see analytics tabs
- [ ] Should NOT see website stats

## 📋 Appointments Management

### View Appointments
- [ ] Go to `/dashboard/appointments`
- [ ] Should see list of all appointments
- [ ] Check appointment cards show:
  - [ ] Name
  - [ ] Phone
  - [ ] Email (if provided)
  - [ ] Branch
  - [ ] Date & Time
  - [ ] Unity Student badge (if applicable)

### Filter Appointments
- [ ] Test "All" filter
- [ ] Test "Today" filter
- [ ] Test "Upcoming" filter
- [ ] Test "Unity" filter
- [ ] Test "Past" filter

### Search Appointments
- [ ] Type name in search box
- [ ] Should filter results
- [ ] Type phone number
- [ ] Should filter results
- [ ] Type email
- [ ] Should filter results

### Send Reminder
- [ ] Click "Send Reminder" button on an appointment
- [ ] Should show success message
- [ ] Check console for reminder details

## 👨‍⚕️ Patients Management

### View Patients
- [ ] Go to `/dashboard/patients`
- [ ] Should see list of patients
- [ ] Test search functionality

### Add Patient (Manager Only)
- [ ] Login as manager
- [ ] Go to `/dashboard/patients`
- [ ] Click "Add New Patient"
- [ ] Fill in form
- [ ] Save
- [ ] Should see new patient in list

## 💊 Prescriptions

### View Prescriptions
- [ ] Go to `/dashboard/prescriptions`
- [ ] Should see list of prescriptions
- [ ] Test search functionality

### Create Prescription
- [ ] Click "Create Prescription"
- [ ] Fill in form
- [ ] Save
- [ ] Should see new prescription in list

## 💰 Sales

### View Sales (Manager Only)
- [ ] Login as manager
- [ ] Go to `/dashboard/sales`
- [ ] Should see sales list
- [ ] Test date range filters
- [ ] Test search functionality

### Staff Access
- [ ] Login as staff
- [ ] Should NOT see Sales in navigation

## 🔧 Settings

### General Settings
- [ ] Go to `/dashboard/settings`
- [ ] Should see clinic information
- [ ] Can edit:
  - [ ] Clinic Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address

### Notification Settings
- [ ] Toggle email notifications
- [ ] Toggle appointment reminders
- [ ] Save settings

### Password Change
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Change Password"
- [ ] Should see success message

## 🌐 Public Website Features

### Home Page
- [ ] Go to `/`
- [ ] Should load without errors
- [ ] Check all sections:
  - [ ] Hero section
  - [ ] Trust badges
  - [ ] Stats cards
  - [ ] Services preview
  - [ ] Unity campaign banner
  - [ ] Testimonials
  - [ ] Partners section
  - [ ] CTA section

### Navigation
- [ ] Click "About" - should go to `/about`
- [ ] Click "Services" - should go to `/services`
- [ ] Click "Branches" - should go to `/branches`
- [ ] Click "Gallery" - should go to `/gallery`
- [ ] Click "Unity Campaign" - should go to `/unity`
- [ ] Click "Book Appointment" - should go to `/book`

### About Page
- [ ] Go to `/about`
- [ ] Should show company story
- [ ] Should show mission, vision, objectives
- [ ] Should show team photo

### Services Page
- [ ] Go to `/services`
- [ ] Should list all services
- [ ] Should have service cards

### Branches Page
- [ ] Go to `/branches`
- [ ] Should show all 4 branches
- [ ] Should have branch cards with details

### Gallery Page
- [ ] Go to `/gallery`
- [ ] Should show image grid
- [ ] Images should load (or show placeholder)

### Unity Campaign Page
- [ ] Go to `/unity`
- [ ] Should show campaign details
- [ ] Should have FAQ section
- [ ] "Book Appointment" button should link to `/book?unity=true`

## 🎨 UI/UX Features

### Dark Mode
- [ ] Click theme toggle (top-right corner)
- [ ] Should switch to dark mode
- [ ] Click again - should switch back
- [ ] Refresh page - theme should persist

### Responsive Design
- [ ] Test on mobile (resize browser)
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] All pages should be responsive

### Loading States
- [ ] Check loading spinners appear
- [ ] Check buttons show loading state when submitting

## 🐛 Common Issues to Check

### Database Connection
- [ ] Verify `.env.local` has correct Supabase credentials
- [ ] Check Supabase project is active
- [ ] Verify tables exist:
  - [ ] `staff`
  - [ ] `public_appointments`
  - [ ] `patients`
  - [ ] `prescriptions`
  - [ ] `sales`
  - [ ] `otp_codes` (if still using)

### RLS Policies
- [ ] Verify RLS is disabled for `otp_codes` (if not using OTP)
- [ ] Verify RLS policies allow public insert for `public_appointments`
- [ ] Verify RLS policies allow authenticated staff to view/manage

### Error Handling
- [ ] Test with invalid credentials
- [ ] Test with missing fields
- [ ] Test with invalid data formats
- [ ] Should show helpful error messages

## ✅ Final Checklist

- [ ] All appointment booking works end-to-end
- [ ] Dashboard shows appointments correctly
- [ ] Manager can manage staff
- [ ] Staff have limited access
- [ ] Password change works
- [ ] All public pages load
- [ ] Dark mode works
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All forms validate correctly

## 🚨 If Something Doesn't Work

1. **Check browser console** (F12) for errors
2. **Check server terminal** for API errors
3. **Check database** - verify tables exist and have data
4. **Check environment variables** - verify `.env.local` is correct
5. **Check network tab** - see what API calls are failing

## 📝 Notes

- Appointment booking is the MAIN feature - must work perfectly
- All forms should validate before submission
- Error messages should be clear and helpful
- Loading states should show during async operations

