import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // 2. Fetch sales (managers see all, staff see only their branch)
    let query = supabaseAdmin
      .from("sales")
      .select("total_amount")
      .gte("sale_date", monthAgo.toISOString().split("T")[0]);

    if (user.role !== "manager") {
      query = query.eq("branch", user.branch);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Monthly Sales API] Supabase error:", error);
      return NextResponse.json({ total: 0 });
    }

    const total = (data || []).reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
    return NextResponse.json({ total });
  } catch (error) {
    console.error("[Monthly Sales API] Fatal GET error:", error);
    return NextResponse.json({ total: 0 });
  }
}
