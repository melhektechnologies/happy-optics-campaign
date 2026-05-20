import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Zod schema for appointment validation
const appointmentSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  branch: z.enum(["head-office", "bole", "kera", "bethzatha"], {
    message: "Invalid branch location",
  }),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  preferred_time: z.string().min(1, "Preferred time is required"),
  reason: z.string().optional(),
  is_unity_student: z.boolean().default(false),
  notes: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

// GET: Retrieve appointments (Staff-Only)
export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabaseAdmin.from("public_appointments").select("*");

    // 2. Enforce Branch Isolation: Non-managers can only see their branch
    if (user.role !== "manager") {
      query = query.eq("branch", user.branch);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[Appointments API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to retrieve appointments records." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("[Appointments API] Fatal GET error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}

// POST: Public appointment request creation
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many booking requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    // 2. Parsing and HoneyPot Anti-spam verification
    const body = await request.json();
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json(
        { error: "Spam submission rejected." },
        { status: 400 }
      );
    }

    // 3. Payload Zod validation
    const validated = appointmentSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 4. DB Sync insertion of Appointment
    const appointmentData: Record<string, any> = {
      full_name: data.full_name,
      phone: data.phone,
      branch: data.branch,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      email: data.email || null,
      reason: data.reason || null,
      notes: data.notes || null,
      is_unity_student: data.is_unity_student || false,
    };

    const { data: appointment, error } = await supabaseAdmin
      .from("public_appointments")
      .insert(appointmentData)
      .select()
      .single();

    if (error) {
      console.error("[Appointments API] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to schedule appointment." },
        { status: 500 }
      );
    }

    // 5. Automatic Patient Creation/Linking (Failsafe)
    try {
      const { data: existingPatient } = await supabaseAdmin
        .from("patients")
        .select("id")
        .eq("phone", data.phone)
        .maybeSingle();

      if (!existingPatient) {
        await supabaseAdmin.from("patients").insert({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || null,
          last_visit: data.preferred_date,
        });
      }
    } catch (patientError) {
      console.error("[Appointments API] Patient auto-linking warning:", patientError);
      // Do not block appointment response on patient auto-linking failure
    }

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Appointments API] Fatal POST error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
