import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const { count, error } = await supabaseAdmin
      .from("public_appointments")
      .select("*", { count: "exact", head: true })
      .eq("preferred_date", today);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Error counting today's appointments:", error);
    return NextResponse.json({ count: 0 });
  }
}

