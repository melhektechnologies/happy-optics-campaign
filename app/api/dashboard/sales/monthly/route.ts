import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const { data, error } = await supabaseAdmin
      .from("sales")
      .select("total_amount")
      .gte("sale_date", monthAgo.toISOString().split("T")[0]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ total: 0 });
    }

    const total = (data || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    return NextResponse.json({ total });
  } catch (error) {
    console.error("Error calculating monthly sales:", error);
    return NextResponse.json({ total: 0 });
  }
}

