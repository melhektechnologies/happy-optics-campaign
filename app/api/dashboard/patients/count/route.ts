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

    // 2. Count patient records
    const { count, error } = await supabaseAdmin
      .from("patients")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[Patients Count API] Supabase error:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("[Patients Count API] Fatal GET error:", error);
    return NextResponse.json({ count: 0 });
  }
}
