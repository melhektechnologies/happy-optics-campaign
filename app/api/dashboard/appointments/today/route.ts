import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { branchFilterFor, requireAuth } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const today = new Date().toISOString().split("T")[0];

  let query = supabaseAdmin
    .from("public_appointments")
    .select("*", { count: "exact", head: true })
    .eq("preferred_date", today);

  // Staff: only their branch's appointments.
  const branch = branchFilterFor(auth.user);
  if (branch) query = query.eq("branch", branch);

  const { count, error } = await query;
  if (error) {
    console.error("[appointments/today] error:", error);
    return NextResponse.json({ count: 0 });
  }
  return NextResponse.json({ count: count || 0 });
}
