import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

// Zod Validation Schema for Sales
const saleSchema = z.object({
  patient_id: z.string().uuid("Invalid patient reference"),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  total_amount: z.number().min(0, "Total amount must be greater than or equal to 0"),
  items: z.string().min(1, "Items/services description is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  branch: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

    let query = supabaseAdmin
      .from("sales")
      .select(`
        id,
        patient_id,
        sale_date,
        total_amount,
        items,
        payment_method,
        branch,
        notes,
        created_at,
        patients (
          full_name
        )
      `);

    // 2. Enforce Branch Isolation: Non-managers can only see sales from their branch
    if (user.role !== "manager") {
      query = query.eq("branch", user.branch);
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
      console.error("[Sales API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sales records." },
        { status: 500 }
      );
    }

    // Format output to include patient_name flatten from join
    const formattedData = (data || []).map((sale: any) => ({
      ...sale,
      patient_name: sale.patients?.full_name || "Unknown Patient",
      patients: undefined, // remove nested object
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[Sales API] Fatal GET error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Secure Authentication Check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Payload Parsing & Validation
    const body = await request.json();
    const validated = saleSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 3. Enforce Branch Isolation: Non-managers can only insert sales for their own branch
    if (user.role !== "manager" && data.branch !== user.branch) {
      return NextResponse.json(
        { error: "Forbidden: Staff are restricted to recording sales at their assigned branch." },
        { status: 403 }
      );
    }

    // 4. Map payment method to database CHECK constraint ('cash', 'card', 'mobile', 'other')
    let mappedPaymentMethod = data.payment_method.toLowerCase();
    if (!["cash", "card", "mobile", "other"].includes(mappedPaymentMethod)) {
      mappedPaymentMethod = "other";
    }

    // 5. Database Sync insertion
    const { data: sale, error } = await supabaseAdmin
      .from("sales")
      .insert({
        patient_id: data.patient_id,
        sale_date: data.sale_date,
        total_amount: data.total_amount,
        items: data.items,
        payment_method: mappedPaymentMethod,
        branch: data.branch,
        staff_id: user.id, // Auto-link to the staff user recording the sale
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[Sales API] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database synchronization failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("[Sales API] Fatal POST error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
