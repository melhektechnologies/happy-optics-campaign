# 🔐 Environment Variables Setup Guide

## Quick Start

1. **Copy the template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your values** (see instructions below)

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Required Variables

### 1. Supabase Configuration

**Where to get:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the values:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:**
- `SUPABASE_SERVICE_ROLE_KEY` is **SECRET** - never share it!
- Keep it secure and never commit to git

### 2. JWT Secret

**Generate a secure JWT secret:**

**Option 1: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Using PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Add to .env.local:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

## Optional Variables

### 3. Site URL (for SEO)

**Local development:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. Twilio SMS (for appointment reminders)

**Only needed if you want SMS reminders**

1. Sign up at [Twilio](https://www.twilio.com)
2. Get credentials from [Twilio Console](https://www.twilio.com/console)
3. Add to .env.local:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

**Leave empty if you don't need SMS:**
```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Complete .env.local Example

```env
# Supabase (REQUIRED)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example

# JWT Secret (REQUIRED)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Site URL (OPTIONAL)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Twilio (OPTIONAL - leave empty if not using)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Verification

After setting up, verify your environment variables:

1. **Check if file exists:**
   ```bash
   ls -la .env.local  # Linux/Mac
   dir .env.local     # Windows
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Test login:**
   - Go to `/auth/login`
   - Try logging in
   - Check console for errors

## Common Issues

### "Missing SUPABASE_URL"
- Check `.env.local` exists
- Verify variable name is exactly `SUPABASE_URL`
- Restart dev server

### "Missing SUPABASE_SERVICE_ROLE_KEY"
- Check `.env.local` exists
- Verify variable name is exactly `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server

### "JWT_SECRET is not defined"
- Generate JWT secret (see above)
- Add to `.env.local`
- Restart dev server

### Variables not loading
- Make sure file is named exactly `.env.local` (not `.env.local.txt`)
- Check for typos in variable names
- Restart dev server after changes
- Clear Next.js cache: `rm -rf .next` then restart

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (should be automatic)
- [ ] Never commit `.env.local` to git
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret
- [ ] `JWT_SECRET` is long and random (32+ characters)
- [ ] Different secrets for development and production
- [ ] Don't share credentials in chat/email

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. Go to project settings
2. Add environment variables
3. Use the same variable names
4. Use **production** values (different from local)

**Never use development secrets in production!**

## Need Help?

- Check `JWT-SECRET-GUIDE.md` for JWT secret generation
- Check `FIX-LOGIN-ISSUES.md` for login troubleshooting
- Check Supabase dashboard for API keys
- Check Twilio console for SMS credentials

