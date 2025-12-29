# Admin Page Access

## Admin Dashboard Location

**URL:** `/admin`

**Full URL:** `http://localhost:3001/admin` (or your domain)

## Features

### 📊 Dashboard Overview
- **Total Appointments** - See all bookings
- **Today's Appointments** - Quick view of today's schedule
- **Upcoming Appointments** - Future bookings
- **Unity Students** - Count of Unity University students

### 🔍 Search & Filter
- **Search Bar** - Search by name, phone, or email
- **Filters:**
  - All Appointments
  - Today
  - Upcoming
  - Past
  - Unity Students Only

### 📱 Reminder System
- **Send Reminder Button** - On each appointment card
- **SMS Integration** - Ready for Twilio (already installed)
- **Manual Fallback** - Logs to console if SMS not configured

### 📥 Export
- **Export CSV** - Download all appointments as CSV file
- Includes all appointment details

### 🔄 Auto-Refresh
- Automatically refreshes every 30 seconds
- Manual refresh button available

### 👁️ View Details
- Click "View Details" to see full appointment information
- Modal popup with all patient and appointment data

## Twilio Setup (For SMS Reminders)

### 1. Get Twilio Credentials
1. Sign up at [Twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a phone number from Twilio

### 2. Add to Environment Variables

Add to `.env.local`:

```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

### 3. Deploy to Vercel

Add the same variables in Vercel:
- Settings → Environment Variables
- Add all three TWILIO_* variables

### 4. Test

Once configured, reminders will be sent via SMS automatically!

## Current Status

✅ **Twilio is installed** (`twilio@5.11.1`)

⚠️ **Twilio not yet configured** - Reminders are currently logged to console

Once you add the environment variables, SMS reminders will work automatically!

## Security Note

⚠️ **Important:** The admin page currently has no authentication. 

For production, add:
- Password protection
- Authentication system
- API route protection

Example quick protection:
```typescript
// Add to app/admin/page.tsx
const [password, setPassword] = useState("");
const [authenticated, setAuthenticated] = useState(false);

// Check password before showing dashboard
if (!authenticated) {
  return <PasswordPrompt />;
}
```

