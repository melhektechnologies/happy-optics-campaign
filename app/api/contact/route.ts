import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { internalError, rateLimited } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";
import { getClientIp, rateLimitCheck } from "@/lib/api/rate-limit";

// Public, unauthenticated endpoint for the marketing contact form.
// Rate-limited per IP. The honeypot field rejects naive bots; the schema
// itself enforces sensible length limits.
const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(30).optional().or(z.literal("")),
  message: z.string().min(5).max(2000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimitCheck(ip, {
    key: "contact",
    windowMs: 60 * 60 * 1000,
    max: 5,
  });
  if (!rl.allowed) {
    return rateLimited(
      `Too many messages. Try again in ${rl.retryAfterSeconds} seconds.`
    );
  }

  const body = await parseJsonBody(request, contactSchema);
  if (!body.ok) return body.response;

  if (body.data.honeypot && body.data.honeypot.length > 0) {
    // Pretend success so bots can't detect the trap.
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    name: body.data.name,
    email: body.data.email,
    phone: body.data.phone && body.data.phone.trim() !== "" ? body.data.phone : null,
    message: body.data.message,
    source_ip: ip === "unknown" ? null : ip,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
  });

  if (error) {
    console.error("[contact] insert error:", error.message);
    return internalError("Failed to send message. Please try again.");
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
