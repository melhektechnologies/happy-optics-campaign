import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { branchFilterFor, requireAuth } from "@/lib/auth/server";
import { badRequest, forbidden, internalError } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const ALLOWED_RANGES = new Set(["today", "week", "month", "all"]);
const ALLOWED_BRANCHES = ["head-office", "bole", "kera", "bethzatha"] as const;
const ALLOWED_PAYMENT_METHODS = [
  "cash",
  "card",
  "mobile",
  "bank_transfer",
] as const;

const createSaleSchema = z.object({
  patient_id: z.string().uuid(),
  sale_date: z.string().min(1),
  total_amount: z.number().positive().max(10_000_000),
  items: z.string().min(1).max(2000),
  payment_method: z.enum(ALLOWED_PAYMENT_METHODS),
  branch: z.enum(ALLOWED_BRANCHES),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "month";
  if (!ALLOWED_RANGES.has(range)) {
    return badRequest("Invalid range parameter.");
  }

  try {
    let query = supabaseAdmin.from("sales").select("*");

    // Staff: only their branch. Manager: all branches.
    const branch = branchFilterFor(auth.user);
    if (branch) query = query.eq("branch", branch);

    if (range === "today") {
      query = query.eq("sale_date", new Date().toISOString().split("T")[0]);
    } else if (range === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte("sale_date", weekAgo.toISOString().split("T")[0]);
    } else if (range === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte("sale_date", monthAgo.toISOString().split("T")[0]);
    }

    const { data, error } = await query.order("sale_date", {
      ascending: false,
    });
    if (error) {
      console.error("[sales] fetch error:", error);
      return internalError("Failed to fetch sales.");
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[sales] unexpected error:", err);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, createSaleSchema);
  if (!body.ok) return body.response;

  // Staff can only record sales for their own branch; managers can choose
  // any branch. We never trust the client-supplied value otherwise.
  const ownBranch = branchFilterFor(auth.user);
  if (ownBranch && body.data.branch !== ownBranch) {
    return forbidden("Staff can only record sales for their own branch.");
  }

  // Verify the patient exists before inserting the sale. Cheap one-row
  // existence check; avoids dangling sales pointing at deleted patients.
  const { data: patient, error: patientErr } = await supabaseAdmin
    .from("patients")
    .select("id")
    .eq("id", body.data.patient_id)
    .single();
  if (patientErr || !patient) {
    return badRequest("Patient not found.");
  }

  const { data, error } = await supabaseAdmin
    .from("sales")
    .insert({
      patient_id: body.data.patient_id,
      sale_date: body.data.sale_date,
      total_amount: body.data.total_amount,
      items: body.data.items,
      payment_method: body.data.payment_method,
      branch: body.data.branch,
      created_by: auth.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("[sales] insert error:", error);
    return internalError("Failed to create sale.");
  }
  return NextResponse.json(data, { status: 201 });
}
