import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

// Zod Validation Schema for Prescription Creation
const prescriptionSchema = z.object({
  patient_id: z.string().uuid("Invalid patient reference"),
  prescription_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  right_eye_sphere: z.string().optional().nullable(),
  right_eye_cylinder: z.string().optional().nullable(),
  right_eye_axis: z.string().optional().nullable(),
  left_eye_sphere: z.string().optional().nullable(),
  left_eye_cylinder: z.string().optional().nullable(),
  left_eye_axis: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Retrieve Prescription Records
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(`
        *,
        patients (
          full_name
        )
      `)
      .order("prescription_date", { ascending: false });

    if (error) {
      console.error("[Prescriptions API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch prescriptions." },
        { status: 500 }
      );
    }

    // Flatten patient name from join
    const transformed = (data || []).map((prescription: any) => ({
      ...prescription,
      patient_name: prescription.patients?.full_name || "Unknown Patient",
      patients: undefined, // remove nested object
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("[Prescriptions API] Fatal GET error:", error);
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
    const validated = prescriptionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 3. Database Sync insertion
    const { data: prescription, error } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        patient_id: data.patient_id,
        prescription_date: data.prescription_date,
        right_eye_sphere: data.right_eye_sphere || null,
        right_eye_cylinder: data.right_eye_cylinder || null,
        right_eye_axis: data.right_eye_axis || null,
        left_eye_sphere: data.left_eye_sphere || null,
        left_eye_cylinder: data.left_eye_cylinder || null,
        left_eye_axis: data.left_eye_axis || null,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[Prescriptions API] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database synchronization failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("[Prescriptions API] Fatal POST error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
