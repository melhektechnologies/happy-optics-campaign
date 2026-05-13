import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { branchFilterFor, requireAuth } from "@/lib/auth/server";
import { badRequest, internalError } from "@/lib/api/errors";

const ALLOWED_RANGES = new Set(["today", "week", "month", "all"]);

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
