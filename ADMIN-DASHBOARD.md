# Admin Dashboard Guide

## Accessing the Admin Dashboard

The admin dashboard is available at: **`/dashboard/appointments`**

Example: `http://localhost:3001/dashboard/appointments`

## Features

### 1. View All Appointments
- See all appointment bookings in one place
- View patient details: name, phone, email, branch, date, time
- See Unity student status
- View appointment notes

### 2. Search & Filter
- **Search**: By name, phone number, or email
- **Filters**:
  - All Appointments
  - Today's Appointments
  - Upcoming Appointments
  - Unity Students Only

### 3. Statistics Dashboard
- Total Appointments count
- Today's Appointments count
- Unity Students count
- Filtered Results count

### 4. Send Reminders
- Click "Send Reminder" button on any appointment
- Sends SMS reminder to patient's phone number
- Reminder includes:
  - Patient name
  - Appointment date and time
  - Branch location
  - Contact number for rescheduling

## Reminder System

### Current Implementation
- Reminder functionality is set up and ready
- Currently logs reminder details to console
- Ready for SMS service integration

### To Enable SMS Reminders

1. **Choose an SMS Service Provider:**
   - Twilio (recommended)
   - AWS SNS
   - Other SMS gateway

2. **Install SMS SDK:**
   ```bash
   npm install twilio
   # or
   npm install @aws-sdk/client-sns
   ```

3. **Add Environment Variables:**
   ```bash
   # For Twilio
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Update `/app/api/appointments/reminder/route.ts`:**
   - Uncomment the Twilio integration code
   - Add your credentials
   - Test with a real phone number

### Reminder Message Format
```
Hello [Name], this is a reminder from Happy Optics Optometry Clinic. 
Your appointment is scheduled for [Date] at [Time] at [Branch]. 
Please call us at +251-115584293 if you need to reschedule.
```

## Database Update Required

Run this SQL to add reminder tracking:

```sql
-- Add reminder columns if they don't exist
ALTER TABLE public_appointments 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE;
```

## Security Note

⚠️ **Important**: The current admin dashboard has no authentication. 

**For production, add:**
- Authentication (NextAuth.js, Clerk, etc.)
- Role-based access control
- API route protection
- Environment-based access restrictions

Example protection:
```typescript
// In app/api/appointments/route.ts GET handler
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Future Enhancements

- [ ] Export appointments to CSV/Excel
- [ ] Calendar view
- [ ] Appointment status management (confirmed, cancelled, completed)
- [ ] Automated reminder scheduling (24h before appointment)
- [ ] Email reminders
- [ ] Appointment rescheduling from dashboard
- [ ] Patient history view

