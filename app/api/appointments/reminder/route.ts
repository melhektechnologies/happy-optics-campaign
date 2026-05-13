import { NextRequest, NextResponse } from "next/server";
import twilio, { type Twilio } from "twilio";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

// Triggers paid Twilio SMS. Previously public — anyone with `curl` could
// SMS-bomb arbitrary phone numbers on the clinic's dime. Now manager-only.

let twilioClient: Twilio | null = null;
try {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch {
  // Misconfigured Twilio creds — fall through to the "logged only" path.
}

const reminderSchema = z.object({
  appointmentId: z.string().uuid(),
  phone: z.string().min(7).max(30),
  name: z.string().min(1).max(120),
  date: z.string().min(1),
  time: z.string().min(1),
  branch: z.string().min(1).max(60),
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, "manager");
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, reminderSchema);
  if (!body.ok) return body.response;
  const { appointmentId, phone, name, date, time, branch } = body.data;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const reminderMessage = `Hello ${name}, this is a reminder from Happy Optics Optometry Clinic. Your appointment is scheduled for ${formattedDate} at ${time} at ${branch}. Please call us at +251-115584293 if you need to reschedule. Thank you!`;

  let smsStatus: "sent" | "failed" | "logged" = "logged";
  let smsSid: string | null = null;

  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      // Normalize to Ethiopian E.164 unless already in E.164.
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = formattedPhone.startsWith("0")
          ? `+251${formattedPhone.substring(1)}`
          : `+251${formattedPhone}`;
      }

      const message = await twilioClient.messages.create({
        body: reminderMessage,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      smsStatus = "sent";
      smsSid = message.sid;
    } catch (twilioError) {
      console.error("[reminder] twilio error:", twilioError);
      smsStatus = "failed";
    }
  }

  // Best-effort: record that we tried, even if Twilio failed.
  try {
    await supabaseAdmin
      .from("public_appointments")
      .update({
        reminder_sent: smsStatus === "sent",
        reminder_sent_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);
  } catch (dbError) {
    console.error("[reminder] db update error:", dbError);
  }

  if (smsStatus === "sent") {
    return NextResponse.json({
      success: true,
      smsStatus,
      smsSid,
    });
  }
  if (smsStatus === "failed") {
    return internalError("Failed to send SMS. Check Twilio configuration.");
  }
  return NextResponse.json({
    success: false,
    smsStatus: "logged",
    message: "Twilio not configured. Reminder logged but not sent.",
  });
}
