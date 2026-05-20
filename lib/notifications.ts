import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendAppointmentConfirmation({
  email,
  phone,
  patientName,
  date,
  time,
  branch,
}: {
  email?: string;
  phone?: string;
  patientName: string;
  date: string;
  time: string;
  branch: string;
}) {
  const results: { email?: unknown; sms?: unknown } = {};

  // 1. Send Email Notification via Resend
  if (email && process.env.RESEND_API_KEY) {
    try {
      results.email = await resend.emails.send({
        from: 'Happy Optics <noreply@happyoptics.com>',
        to: [email],
        subject: 'Appointment Confirmed - Happy Optics',
        html: `
          <div style="font-family: sans-serif; color: #1a1a1a;">
            <h1 style="color: #0d7377;">Vision Appointment Confirmed</h1>
            <p>Dear ${patientName},</p>
            <p>Your appointment has been successfully scheduled.</p>
            <div style="background: #f5f4f2; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Location:</strong> Happy Optics - ${branch}</p>
            </div>
            <p style="margin-top: 20px;">Please arrive 10 minutes before your scheduled time.</p>
            <p>Thank you for choosing Happy Optics!</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[Notification] Email failed:', err);
    }
  }

  // 2. Send SMS Notification via Twilio
  if (phone && process.env.TWILIO_ACCOUNT_SID) {
    try {
      results.sms = await twilioClient.messages.create({
        body: `Happy Optics: Hi ${patientName}, your appointment at our ${branch} branch is confirmed for ${date} at ${time}. We look forward to seeing you!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (err) {
      console.error('[Notification] SMS failed:', err);
    }
  }

  return results;
}
