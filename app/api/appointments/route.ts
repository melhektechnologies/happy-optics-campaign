import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { branchFilterFor, requireAuth } from "@/lib/auth/server";
import { internalError, rateLimited } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

// In-memory per-IP rate limit for the public booking endpoint. Good enough
// for a single Next.js instance; for multi-instance deployments swap for
// Redis or Upstash.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

const BRANCHES = ["head-office", "bole", "kera", "bethzatha"] as const;

const appointmentSchema = z.object({
  full_name: z.string().min(2).max(120),
  phone: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal("")),
  branch: z.enum(BRANCHES),
  preferred_date: z.string().min(1),
  preferred_time: z.string().min(1),
  reason: z.string().max(500).optional(),
  is_unity_student: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
  honeypot: z.string().max(0).optional(),
});

/**
 * Public booking endpoint. This is the only API endpoint that does NOT
 * require authentication.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return rateLimited("Too many booking attempts. Please try again later.");
  }

  const body = await parseJsonBody(request, appointmentSchema);
  if (!body.ok) return body.response;
  const data = body.data;

  // Honeypot — bots fill hidden fields. Schema already enforces empty, but
  // we keep the explicit check for clarity.
  if (data.honeypot && data.honeypot.length > 0) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const appointmentInsert = {
    full_name: data.full_name,
    phone: data.phone,
    email: data.email && data.email.trim() !== "" ? data.email : null,
    branch: data.branch,
    preferred_date: data.preferred_date,
    preferred_time: data.preferred_time,
    reason: data.reason || null,
    notes: data.notes || null,
    is_unity_student: data.is_unity_student ?? false,
  };

  const { data: appointment, error } = await supabaseAdmin
    .from("public_appointments")
    .insert(appointmentInsert)
    .select()
    .single();

  if (error) {
    console.error("[appointments] insert error:", error);
    return internalError("Failed to save appointment. Please try again.");
  }

  // Best-effort patient autocreate. We treat the appointment as the
  // primary record; if the patient upsert fails we log it but do NOT roll
  // back the appointment — losing a confirmed booking would be a worse
  // user experience than a duplicate patient row to clean up later.
  try {
    const { data: existing } = await supabaseAdmin
      .from("patients")
      .select("id")
      .eq("phone", data.phone)
      .maybeSingle();

    if (!existing) {
      const { error: patientError } = await supabaseAdmin
        .from("patients")
        .insert({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || null,
        });
      if (patientError) {
        console.warn(
          "[appointments] patient autocreate failed (non-fatal):",
          patientError.message
        );
      }
    }
  } catch (patientErr) {
    console.warn("[appointments] patient autocreate threw:", patientErr);
  }

  return NextResponse.json(
    { success: true, data: appointment },
    { status: 201 }
  );
}

/** Authenticated read of appointments. Branch-isolated for staff. */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  let query = supabaseAdmin.from("public_appointments").select("*");
  const branch = branchFilterFor(auth.user);
  if (branch) query = query.eq("branch", branch);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("[appointments] fetch error:", error);
    return internalError("Failed to fetch appointments.");
  }
  return NextResponse.json(data || []);
}
