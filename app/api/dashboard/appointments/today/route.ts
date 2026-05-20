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

    const today = new Date().toISOString().split("T")[0];
    
    // 2. Count today's appointments (managers see all, staff see only their branch)
    let query = supabaseAdmin
      .from("public_appointments")
      .select("*", { count: "exact", head: true })
      .eq("preferred_date", today);

    if (user.role !== "manager") {
      query = query.eq("preferred_branch", user.branch);
    }

    const { count, error } = await query;

    if (error) {
      console.error("[Today Appointments API] Supabase error:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("[Today Appointments API] Fatal GET error:", error);
    return NextResponse.json({ count: 0 });
  }
}
