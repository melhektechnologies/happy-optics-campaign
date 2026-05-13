import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";

// Patient records are not branch-scoped in the current schema; a patient
// can be served by any branch. Any authenticated staff member can see the
// total count.
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { count, error } = await supabaseAdmin
    .from("patients")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[patients/count] error:", error);
    return NextResponse.json({ count: 0 });
  }
  return NextResponse.json({ count: count || 0 });
}
