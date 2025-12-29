import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(`
        *,
        patients:patient_id (
          full_name
        )
      `)
      .order("prescription_date", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch prescriptions." },
        { status: 500 }
      );
    }

    // Transform data to include patient name
    const transformed = (data || []).map((prescription: any) => ({
      ...prescription,
      patient_name: prescription.patients?.full_name || "Unknown",
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, prescription_date, right_eye_sphere, right_eye_cylinder, right_eye_axis, left_eye_sphere, left_eye_cylinder, left_eye_axis, notes } = body;

    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        patient_id,
        prescription_date,
        right_eye_sphere: right_eye_sphere || null,
        right_eye_cylinder: right_eye_cylinder || null,
        right_eye_axis: right_eye_axis || null,
        left_eye_sphere: left_eye_sphere || null,
        left_eye_cylinder: left_eye_cylinder || null,
        left_eye_axis: left_eye_axis || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create prescription." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

