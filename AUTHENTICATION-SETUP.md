# 🔐 Authentication System Setup Guide

## Overview

The system now includes a complete authentication system with:
- Email/Password login
- OTP (One-Time Password) verification via email
- Role-based access control (Manager vs Staff)
- Secure password change functionality
- JWT token-based authentication

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Already installed:
- `jsonwebtoken` - JWT token generation
- `@types/jsonwebtoken` - TypeScript types

### Step 2: Database Setup

Run the SQL from `DATABASE-AUTH-SCHEMA.md` in your Supabase SQL Editor:

1. Add `password_hash` column to `staff` table
2. Create `otp_codes` table
3. Create initial manager account
4. Create sample staff accounts

### Step 3: Environment Variables

Add to your `.env.local`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Create Initial Accounts

Run the SQL from `DATABASE-AUTH-SCHEMA.md` to create:
- Manager account: `happy.optics.manager@gmail.com` (password: `manager123`)
- Staff accounts for testing

**⚠️ IMPORTANT**: Change all default passwords immediately!

## 🔑 Login Flow

### 1. Email/Password Login
- User enters email and password
- System verifies credentials
- If valid, generates OTP and sends to email

### 2. OTP Verification
- User enters 6-digit OTP code
- System verifies OTP
- If valid, generates JWT token and logs user in

### 3. Session Management
- JWT token stored in localStorage
- Token expires after 7 days
- User role and branch stored in localStorage

## 👥 Role-Based Access

### Manager Role
**Full Access:**
- ✅ View all patients across all branches
- ✅ Manage all appointments
- ✅ View analytics and website stats
- ✅ Manage staff across all branches
- ✅ View sales and revenue
- ✅ Create prescriptions
- ✅ System settings

**Navigation:**
- Dashboard (with analytics)
- Patients
- Appointments
- Prescriptions
- Sales
- Staff
- Settings

### Staff Role
**Limited Access:**
- ✅ View appointments for their branch only
- ✅ Create prescriptions
- ✅ View their own profile
- ❌ Cannot view patients (unless needed)
- ❌ Cannot view sales
- ❌ Cannot manage staff
- ❌ Cannot view analytics

**Navigation:**
- Dashboard (basic stats only)
- Appointments (branch-filtered)
- Prescriptions
- Settings

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- Current password verification
- New password confirmation

### OTP Security
- 6-digit random code
- 10-minute expiration
- Single-use only
- Email delivery (configure email service)

### Token Security
- JWT with 7-day expiration
- Stored in localStorage (consider httpOnly cookies for production)
- Automatic verification on each request

## 📧 Email Configuration (Production)

Currently, OTP is logged to console. For production:

1. **Option 1: Use Resend**
```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "noreply@happyoptics.com",
  to: email,
  subject: "Your OTP Code",
  html: `<p>Your OTP code is: <strong>${otpCode}</strong></p>`,
});
```

2. **Option 2: Use SendGrid**
```typescript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: "noreply@happyoptics.com",
  subject: "Your OTP Code",
  html: `<p>Your OTP code is: <strong>${otpCode}</strong></p>`,
});
```

## 🎯 Usage

### Login
1. Go to `/auth/login`
2. Enter email and password
3. Enter OTP sent to email
4. Redirected to `/dashboard`

### Change Password
1. Go to `/dashboard/settings`
2. Enter current password
3. Enter new password (min 8 chars)
4. Confirm new password
5. Click "Change Password"

### Sign Out
- Click "Sign Out" in sidebar or top bar
- Clears all auth data
- Redirects to login page

## 🛡️ Production Security Checklist

- [ ] Use bcrypt for password hashing (currently plain text - TEMPORARY)
- [ ] Configure email service for OTP delivery
- [ ] Use httpOnly cookies for JWT tokens
- [ ] Add rate limiting to login endpoint
- [ ] Add CSRF protection
- [ ] Use secure, random JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Add password complexity requirements
- [ ] Add account lockout after failed attempts
- [ ] Add session timeout

## 📝 Default Credentials

**Manager:**
- Email: `happy.optics.manager@gmail.com`
- Password: `manager123` (CHANGE IMMEDIATELY!)

**Staff:**
- Email: `john.optometrist@happyoptics.com`
- Password: `staff123` (CHANGE IMMEDIATELY!)

## 🔧 Troubleshooting

### OTP Not Received?
- Check console logs (development)
- Verify email service is configured (production)
- Check spam folder
- Verify email address is correct

### Login Fails?
- Verify user exists in `staff` table
- Check password is correct
- Verify OTP hasn't expired
- Check browser console for errors

### Access Denied?
- Verify user role in database
- Check JWT token is valid
- Verify route permissions match user role

## 🎉 Features

✅ Email/Password authentication
✅ OTP verification
✅ Role-based access control
✅ Secure password change
✅ Session management
✅ Auto-logout on token expiry
✅ Protected routes
✅ Different views for manager vs staff

The authentication system is ready! 🚀

