# 📱 Reminder System Setup Guide

## Current Status

The reminder system is **working**, but it's currently **logging to console** instead of sending actual SMS because Twilio is not configured.

## How It Works

### Without Twilio (Current State)
- ✅ Reminder is logged to server console
- ✅ Database is updated (reminder_sent = true)
- ❌ No actual SMS is sent
- ⚠️ Frontend shows "successfully sent" but it's just logged

### With Twilio (After Setup)
- ✅ Actual SMS is sent to patient's phone
- ✅ Database is updated
- ✅ Real-time delivery confirmation

## Setup Twilio for Actual SMS

### Step 1: Get Twilio Account

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Verify your account
3. Get a phone number (trial account has limitations)

### Step 2: Get Credentials

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Find:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
   - **Phone Number** → `TWILIO_PHONE_NUMBER` (format: +1234567890)

### Step 3: Add to .env.local

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Restart Server

```bash
npm run dev
```

### Step 5: Test

1. Go to `/dashboard/appointments`
2. Click "Send Reminder" on an appointment
3. Should see: "✅ SMS Reminder sent successfully"
4. Patient should receive SMS

## Current Behavior (Without Twilio)

When you click "Send Reminder":

1. **Server Console** shows:
   ```
   ⚠️ Twilio not configured. Reminder logged only:
   --- REMINDER MESSAGE ---
   To: +251911111111
   Message: Hello John, this is a reminder...
   --- END REMINDER ---
   ```

2. **Database** is updated:
   - `reminder_sent = true`
   - `reminder_sent_at = current timestamp`

3. **Frontend** shows:
   - Alert with reminder details
   - Message that Twilio is not configured

## Phone Number Formatting

The system automatically formats Ethiopian phone numbers:
- `0911111111` → `+251911111111`
- `+251911111111` → `+251911111111` (unchanged)

## Testing Without Twilio

To test the reminder message format, check server console after clicking "Send Reminder".

## Troubleshooting

### "Reminder sent successfully" but no SMS
- **Check:** Twilio credentials in `.env.local`
- **Check:** Server console for error messages
- **Check:** Twilio account has credits/active phone number

### "Failed to send SMS"
- **Check:** Twilio credentials are correct
- **Check:** Phone number format is valid
- **Check:** Twilio account is not suspended
- **Check:** Server console for detailed error

### Reminder not updating in database
- **Check:** Database connection
- **Check:** `reminder_sent` and `reminder_sent_at` columns exist
- **Check:** Server console for database errors

## Alternative: Manual Reminders

If you don't want to use Twilio, you can:
1. Check server console for reminder messages
2. Manually send SMS/WhatsApp to patients
3. The system still tracks which reminders were "sent" (logged)

## Cost Considerations

- **Twilio Trial:** Free credits for testing
- **Production:** ~$0.0075 per SMS (varies by country)
- **Ethiopia:** Check Twilio pricing for Ethiopia

## Next Steps

1. **For Testing:** Use current setup (console logging)
2. **For Production:** Set up Twilio account and add credentials
3. **For Manual:** Use console output to send reminders manually

The reminder system is functional - it just needs Twilio configuration to send actual SMS! 📱

