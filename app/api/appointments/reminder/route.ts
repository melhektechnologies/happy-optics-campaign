import { NextRequest, NextResponse } from "next/server";
import twilio, { type Twilio } from "twilio";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { badRequest, internalError, notFound } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";
import { safeLog } from "@/lib/logging";

// Sends paid Twilio SMS. Manager-only. The DB row is the source of truth:
// the client may supply hints for display, but every value we send is
// re-derived from `public_appointments` after we load it by id. This
// prevents an attacker who got a manager session from sending SMS to
// arbitrary phone numbers by hand-crafting the request body.

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
  // Misconfigured creds — fall through to the "logged only" path.
}

const reminderSchema = z.object({
  appointmentId: z.string().uuid(),
});

function normalizeToE164(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return trimmed;
  // Ethiopia default.
  return trimmed.startsWith("0")
    ? `+251${trimmed.substring(1)}`
    : `+251${trimmed}`;
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, "manager");
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, reminderSchema);
  if (!body.ok) return body.response;

  // Load the source-of-truth row. We never trust the client for the
  // recipient phone / appointment details.
  const { data: appt, error: fetchErr } = await supabaseAdmin
    .from("public_appointments")
    .select(
      "id, full_name, phone, branch, preferred_date, preferred_time, status"
    )
    .eq("id", body.data.appointmentId)
    .maybeSingle();

  if (fetchErr) {
    console.error("[reminder] fetch error:", fetchErr.message);
    return internalError("Failed to load appointment.");
  }
  if (!appt) return notFound("Appointment not found.");

  if (!appt.phone || appt.phone.trim().length < 7) {
    return badRequest("Appointment has no valid phone number on file.");
  }
  if (appt.status === "cancelled") {
    return badRequest("Cannot send reminder for a cancelled appointment.");
  }

  const formattedDate = new Date(appt.preferred_date).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
  const reminderMessage = `Hello ${appt.full_name}, this is a reminder from Happy Optics Optometry Clinic. Your appointment is scheduled for ${formattedDate} at ${appt.preferred_time} at ${appt.branch}. Please call us at +251-115584293 if you need to reschedule. Thank you!`;

  let smsStatus: "sent" | "failed" | "logged" = "logged";
  let smsSid: string | null = null;

  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const message = await twilioClient.messages.create({
        body: reminderMessage,
        to: normalizeToE164(appt.phone),
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      smsStatus = "sent";
      smsSid = message.sid;
    } catch (twilioError) {
      safeLog.error("[reminder] twilio error:", twilioError);
      smsStatus = "failed";
    }
  }

  try {
    await supabaseAdmin
      .from("public_appointments")
      .update({
        reminder_sent: smsStatus === "sent",
        reminder_sent_at: new Date().toISOString(),
      })
      .eq("id", appt.id);
  } catch (dbError) {
    console.error("[reminder] db update error:", dbError);
  }

  if (smsStatus === "sent") {
    return NextResponse.json({ success: true, smsStatus, smsSid });
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
