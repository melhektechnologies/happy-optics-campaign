import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const createPatientSchema = z.object({
  full_name: z.string().min(2).max(120),
  phone: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal("")).optional(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { data, error } = await supabaseAdmin
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[patients] fetch error:", error);
    return internalError("Failed to fetch patients.");
  }
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, createPatientSchema);
  if (!body.ok) return body.response;

  const { data, error } = await supabaseAdmin
    .from("patients")
    .insert({
      full_name: body.data.full_name,
      phone: body.data.phone,
      email: body.data.email || null,
      date_of_birth: body.data.date_of_birth || null,
      gender: body.data.gender || null,
      address: body.data.address || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[patients] insert error:", error);
    return internalError("Failed to create patient.");
  }
  return NextResponse.json(data, { status: 201 });
}
