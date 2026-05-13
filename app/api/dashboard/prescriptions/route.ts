import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const prescriptionSchema = z.object({
  patient_id: z.string().uuid("patient_id must be a valid UUID"),
  prescription_date: z.string().min(1),
  right_eye_sphere: z.string().max(20).optional().nullable(),
  right_eye_cylinder: z.string().max(20).optional().nullable(),
  right_eye_axis: z.string().max(20).optional().nullable(),
  left_eye_sphere: z.string().max(20).optional().nullable(),
  left_eye_cylinder: z.string().max(20).optional().nullable(),
  left_eye_axis: z.string().max(20).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

type PrescriptionRow = Record<string, unknown> & {
  patients?: { full_name?: string | null } | null;
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { data, error } = await supabaseAdmin
    .from("prescriptions")
    .select(
      `*, patients:patient_id ( full_name )`
    )
    .order("prescription_date", { ascending: false });

  if (error) {
    console.error("[prescriptions] fetch error:", error);
    return internalError("Failed to fetch prescriptions.");
  }

  const transformed = ((data ?? []) as PrescriptionRow[]).map((p) => ({
    ...p,
    patient_name: p.patients?.full_name || "Unknown",
  }));
  return NextResponse.json(transformed);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, prescriptionSchema);
  if (!body.ok) return body.response;

  const { data, error } = await supabaseAdmin
    .from("prescriptions")
    .insert({
      patient_id: body.data.patient_id,
      prescription_date: body.data.prescription_date,
      right_eye_sphere: body.data.right_eye_sphere || null,
      right_eye_cylinder: body.data.right_eye_cylinder || null,
      right_eye_axis: body.data.right_eye_axis || null,
      left_eye_sphere: body.data.left_eye_sphere || null,
      left_eye_cylinder: body.data.left_eye_cylinder || null,
      left_eye_axis: body.data.left_eye_axis || null,
      notes: body.data.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[prescriptions] insert error:", error);
    return internalError("Failed to create prescription.");
  }
  return NextResponse.json(data, { status: 201 });
}
