# 🔐 JWT Secret Generation Guide

## What is JWT_SECRET?

JWT_SECRET is a secret key used to sign and verify JSON Web Tokens (JWT). It ensures that tokens cannot be tampered with and are authentic.

## How to Generate a JWT Secret

### Option 1: Using Node.js (Recommended)

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will generate a 64-character hexadecimal string (32 bytes).

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Option 2: Using OpenSSL

```bash
openssl rand -hex 32
```

### Option 3: Using Online Generator

Visit: https://generate-secret.vercel.app/32

**⚠️ Warning:** Only use trusted online generators. Option 1 or 2 is more secure.

### Option 4: Using PowerShell (Windows)

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Or for a more secure version:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

## Setting the JWT Secret

### Local Development (.env.local)

Create or edit `.env.local` in your project root:

```env
JWT_SECRET=your-generated-secret-key-here-minimum-32-characters
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Example:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add:
   - **Name:** `JWT_SECRET`
   - **Value:** Your generated secret (paste it)
   - **Environment:** Production, Preview, Development (select all)
5. Click **Save**

### Production (Other Platforms)

#### Heroku
```bash
heroku config:set JWT_SECRET=your-generated-secret
```

#### Railway
Add in Railway dashboard → Variables

#### Docker
```dockerfile
ENV JWT_SECRET=your-generated-secret
```

## Security Best Practices

### ✅ DO:
- Use a **minimum of 32 characters** (64+ recommended)
- Use **random, unpredictable** strings
- **Never commit** JWT_SECRET to git
- Use **different secrets** for development and production
- **Rotate secrets** periodically (every 6-12 months)
- Store in **environment variables** only

### ❌ DON'T:
- Use simple words or phrases
- Use predictable patterns
- Commit to version control
- Share in chat/email
- Use the same secret for all environments
- Use short secrets (< 32 characters)

## Example: Complete Setup

### Step 1: Generate Secret

```bash
# In your terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output:
```
f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

### Step 2: Add to .env.local

```env
JWT_SECRET=f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

### Step 3: Verify It Works

Restart your dev server:
```bash
npm run dev
```

Try logging in - if it works, the JWT_SECRET is set correctly!

## Troubleshooting

### Error: "JWT_SECRET is not defined"
- Check `.env.local` exists in project root
- Verify variable name is exactly `JWT_SECRET`
- Restart dev server after adding
- Check for typos or extra spaces

### Error: "Invalid token"
- Verify JWT_SECRET matches between environments
- Check token hasn't expired
- Ensure secret hasn't changed (would invalidate all tokens)

### Token Works Locally But Not in Production
- Verify JWT_SECRET is set in production environment
- Check environment variable name matches exactly
- Ensure no extra spaces or quotes

## Quick Reference

**Generate Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add to .env.local:**
```env
JWT_SECRET=your-generated-secret-here
```

**Verify:**
- Restart server
- Try login
- Check console for errors

## Security Checklist

- [ ] Secret is 32+ characters
- [ ] Secret is random and unpredictable
- [ ] Secret is in `.env.local` (not committed)
- [ ] Secret is set in production environment
- [ ] Different secrets for dev/prod
- [ ] `.env.local` is in `.gitignore`

Your JWT_SECRET is now ready! 🔐

