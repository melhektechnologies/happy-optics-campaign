# Happy Optics Campaign - Deployment Guide

This guide will help you deploy the Happy Optics Optometry Clinic marketing website.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Vercel account (recommended) or another hosting platform

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site URL (for SEO)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Database Setup

### Create the Appointments Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create public_appointments table
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public_appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_branch ON public_appointments(branch);

-- Enable Row Level Security (RLS)
ALTER TABLE public_appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert (for API)
-- Note: Since we use service_role_key in the API, RLS is bypassed
-- But we can add a policy for future admin access if needed
CREATE POLICY "Allow service role full access"
  ON public_appointments
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Optional: Create Admin View (for dashboard)

If you plan to build an admin dashboard later:

```sql
-- Create a view for admin access (example)
CREATE OR REPLACE VIEW admin_appointments AS
SELECT 
  id,
  full_name,
  phone,
  email,
  branch,
  preferred_date,
  preferred_time,
  reason,
  is_unity_student,
  notes,
  created_at
FROM public_appointments
ORDER BY created_at DESC;
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repository and push:
   ```bash
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure environment variables:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_SITE_URL` (set to your Vercel domain or custom domain)

5. Click **"Deploy"**

### Step 3: Update Supabase CORS (if needed)

If you encounter CORS issues:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Add your Vercel domain to **Allowed CORS origins**

## Brand Assets

### Required Images

Add the following images to the project:

1. **Logo:**
   - Path: `/public/brand/happy-optics-logo.png`
   - Recommended: 512x512px, transparent background, PNG format

2. **Clinic Photo:**
   - Path: `/public/brand/clinic.jpg`
   - Recommended: 1920x1080px or larger, JPG format

3. **Gallery Images (optional):**
   - Path: `/public/gallery/`
   - See `/public/gallery/README.md` for details

### Stock Image Recommendations

If you need stock images, search for:
- "modern optometry clinic interior"
- "luxury eye care clinic"
- "professional optometry office"
- "premium eyewear store interior"

## Testing the Appointment Booking

1. Navigate to `/book` on your deployed site
2. Fill out the appointment form
3. Submit the form
4. Check your Supabase dashboard → **Table Editor** → `public_appointments` to verify the submission

## Security Notes

- **Never commit** `.env.local` or `.env` files to git
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret
- Rate limiting is implemented in-memory (for production, consider Redis)
- Honeypot field helps prevent spam submissions

## Troubleshooting

### "Missing SUPABASE_URL" Error

- Ensure all environment variables are set in Vercel
- Redeploy after adding environment variables

### Appointments Not Saving

- Check Supabase table exists and has correct schema
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase logs for errors

### Images Not Loading

- Ensure images are in the correct `/public/brand/` and `/public/gallery/` folders
- Check file names match exactly (case-sensitive)
- Verify images are committed to git

## Next Steps

- Customize content and images
- Set up email notifications for new appointments (optional)
- Build admin dashboard to view appointments
- Add analytics (Google Analytics, etc.)
- Set up custom domain

## Support

For issues or questions, check:
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs

