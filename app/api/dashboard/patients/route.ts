import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

// Zod Validation Schema for Patient Creation
const patientSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Retrieve Patient Records
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Patients API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to retrieve patients records." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("[Patients API] Fatal GET error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Payload Validation
    const body = await request.json();
    const validated = patientSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 3. Database Sync insertion
    const { data: patient, error } = await supabaseAdmin
      .from("patients")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        address: data.address || null,
        last_visit: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("[Patients API] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database synchronization failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error("[Patients API] Fatal POST error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
