import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { branchFilterFor, requireAuth } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  let query = supabaseAdmin
    .from("sales")
    .select("total_amount")
    .gte("sale_date", monthAgo.toISOString().split("T")[0]);

  // Staff: only their branch.
  const branch = branchFilterFor(auth.user);
  if (branch) query = query.eq("branch", branch);

  const { data, error } = await query;
  if (error) {
    console.error("[sales/monthly] error:", error);
    return NextResponse.json({ total: 0 });
  }

  const total = (data || []).reduce(
    (sum: number, sale: { total_amount: number | null }) =>
      sum + (sale.total_amount || 0),
    0
  );
  return NextResponse.json({ total });
}
