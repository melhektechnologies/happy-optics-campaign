import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  signSession,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth/jwt";
import { unauthorized, internalError, notFound } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(10),
});

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request, otpSchema);
  if (!body.ok) return body.response;

  const { email, otp } = body.data;

  try {
    const { data: otpRecord } = await supabaseAdmin
      .from("otp_codes")
      .select("id")
      .eq("email", email.toLowerCase())
      .eq("otp_code", otp)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!otpRecord) return unauthorized("Invalid or expired OTP");

    await supabaseAdmin
      .from("otp_codes")
      .update({ used: true })
      .eq("id", otpRecord.id);

    const { data: staff } = await supabaseAdmin
      .from("staff")
      .select("id, email, role, branch, full_name, status")
      .eq("email", email.toLowerCase())
      .single();

    if (!staff) return notFound("User not found");
    if (staff.status && staff.status !== "active") {
      return unauthorized("Account is not active");
    }

    const token = signSession({
      id: staff.id,
      email: staff.email,
      role: staff.role,
      branch: staff.branch,
    });

    const response = NextResponse.json({
      user: {
        id: staff.id,
        email: staff.email,
        role: staff.role,
        branch: staff.branch,
        name: staff.full_name,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[verify-otp] unexpected error:", err);
    return internalError();
  }
}
