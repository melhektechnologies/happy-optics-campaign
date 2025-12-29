import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// Twilio client (only initialize if credentials are available)
let twilioClient: any = null;
try {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    const twilio = require("twilio");
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch (error) {
  console.log("Twilio not configured, reminders will be logged only");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, phone, name, date, time, branch } = body;

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reminderMessage = `Hello ${name}, this is a reminder from Happy Optics Optometry Clinic. Your appointment is scheduled for ${formattedDate} at ${time} at ${branch}. Please call us at +251-115584293 if you need to reschedule. Thank you!`;

    let smsStatus = "logged";
    let smsSid = null;

    // Send SMS via Twilio if configured
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Format phone number (add country code if needed)
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith("+")) {
          // Assume Ethiopian number, add +251
          formattedPhone = formattedPhone.startsWith("0")
            ? `+251${formattedPhone.substring(1)}`
            : `+251${formattedPhone}`;
        }

        console.log(`📱 Attempting to send SMS to: ${formattedPhone}`);

        const message = await twilioClient.messages.create({
          body: reminderMessage,
          to: formattedPhone,
          from: process.env.TWILIO_PHONE_NUMBER,
        });

        smsStatus = "sent";
        smsSid = message.sid;
        console.log("✅ SMS sent successfully via Twilio. SID:", message.sid);
      } catch (twilioError: any) {
        console.error("❌ Twilio SMS error:", twilioError);
        console.error("Error details:", {
          code: twilioError.code,
          message: twilioError.message,
          status: twilioError.status,
        });
        smsStatus = "failed";
      }
    } else {
      console.log("\n⚠️ Twilio not configured. Reminder logged only:");
      console.log("--- REMINDER MESSAGE ---");
      console.log(`To: ${phone}`);
      console.log(`Message: ${reminderMessage}`);
      console.log("--- END REMINDER ---\n");
      console.log("💡 To enable SMS, add to .env.local:");
      console.log("TWILIO_ACCOUNT_SID=your-account-sid");
      console.log("TWILIO_AUTH_TOKEN=your-auth-token");
      console.log("TWILIO_PHONE_NUMBER=+1234567890\n");
    }

    // Update database to mark reminder as sent
    try {
      await supabaseAdmin
        .from("public_appointments")
        .update({
          reminder_sent: true,
          reminder_sent_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);
    } catch (dbError) {
      console.error("Error updating reminder status:", dbError);
      // Continue even if DB update fails
    }

    // Return appropriate response based on actual status
    if (smsStatus === "sent") {
      return NextResponse.json({
        success: true,
        message: "Reminder sent successfully via SMS",
        smsStatus: "sent",
        smsSid,
      });
    } else if (smsStatus === "failed") {
      return NextResponse.json({
        success: false,
        message: "Failed to send SMS. Reminder logged to console. Check Twilio configuration.",
        smsStatus: "failed",
        error: "Twilio SMS failed",
      }, { status: 500 });
    } else {
      // Twilio not configured - logged only
      return NextResponse.json({
        success: false,
        message: "Twilio not configured. Reminder message logged to server console. Configure Twilio credentials to send actual SMS.",
        smsStatus: "logged",
        logged: true,
        reminderMessage: reminderMessage,
        phone: phone,
      }, { status: 200 }); // 200 because it was "successfully" logged
    }
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder. Please try again." },
      { status: 500 }
    );
  }
}

