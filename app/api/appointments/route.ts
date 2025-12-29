import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Simple in-memory rate limiting (in production, use Redis or similar)
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

const appointmentSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  branch: z.enum(["head-office", "bole", "kera", "bethzatha"]),
  preferred_date: z.string(),
  preferred_time: z.string(),
  reason: z.string().optional(),
  is_unity_student: z.boolean().default(false),
  notes: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Check honeypot
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // Validate data
    const validatedData = appointmentSchema.parse(body);

    // Prepare data for insertion
    const appointmentData: Record<string, any> = {
      full_name: validatedData.full_name,
      phone: validatedData.phone,
      branch: validatedData.branch,
      preferred_date: validatedData.preferred_date,
      preferred_time: validatedData.preferred_time,
    };

    // Add optional fields
    if (validatedData.email && validatedData.email.trim() !== "") {
      appointmentData.email = validatedData.email;
    }
    if (validatedData.reason && validatedData.reason.trim() !== "") {
      appointmentData.reason = validatedData.reason;
    }
    if (validatedData.notes && validatedData.notes.trim() !== "") {
      appointmentData.notes = validatedData.notes;
    }
    // Add is_unity_student (will be added to table if missing)
    appointmentData.is_unity_student = validatedData.is_unity_student || false;

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from("public_appointments")
      .insert(appointmentData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to save appointment: ${error.message}. Please check if the table exists and RLS is configured.` },
        { status: 500 }
      );
    }

    // Auto-create patient from appointment if doesn't exist
    try {
      const { data: existingPatient } = await supabaseAdmin
        .from("patients")
        .select("id")
        .eq("phone", validatedData.phone)
        .single();

      if (!existingPatient) {
        await supabaseAdmin.from("patients").insert({
          full_name: validatedData.full_name,
          phone: validatedData.phone,
          email: validatedData.email || null,
        });
      }
    } catch (patientError) {
      // Log but don't fail the appointment creation
      console.log("Note: Could not auto-create patient:", patientError);
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Appointment submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all appointments (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check authentication and role
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    let userBranch: string | null = null;
    let userRole: string | null = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string; branch: string };
        userRole = decoded.role;
        userBranch = decoded.branch;
      } catch (error) {
        // Token invalid, continue without filtering (for backward compatibility)
      }
    }
    
    let query = supabaseAdmin
      .from("public_appointments")
      .select("*");

    // Non-manager users can only see appointments from their branch
    if (userRole && userRole !== "manager" && userBranch) {
      query = query.eq("branch", userBranch);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch appointments." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
