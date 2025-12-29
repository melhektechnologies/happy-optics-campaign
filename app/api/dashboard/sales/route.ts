import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request: NextRequest) {
  try {
    // Check authentication and role
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    let userBranch: string | null = null;
    let userRole: string | null = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string; branch: string };
        userRole = decoded.role;
        userBranch = decoded.branch;
      } catch (error) {
        // Token invalid, but continue (might be manager accessing without token in some cases)
      }
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

    let query = supabaseAdmin.from("sales").select("*");

    // Non-manager users can only see sales from their branch
    if (userRole && userRole !== "manager" && userBranch) {
      query = query.eq("branch", userBranch);
    }

    if (range === "today") {
      const today = new Date().toISOString().split("T")[0];
      query = query.eq("sale_date", today);
    } else if (range === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte("sale_date", weekAgo.toISOString().split("T")[0]);
    } else if (range === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte("sale_date", monthAgo.toISOString().split("T")[0]);
    }

    const { data, error } = await query.order("sale_date", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sales." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

