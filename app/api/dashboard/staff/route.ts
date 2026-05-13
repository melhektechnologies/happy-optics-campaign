import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  branchFilterFor,
  requireAuth,
  requireRole,
} from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const BRANCHES = ["head-office", "bole", "kera", "bethzatha"] as const;
const ROLES = [
  "manager",
  "optometrist",
  "receptionist",
  "technician",
  "sales",
] as const;

const createStaffSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  branch: z.enum(BRANCHES),
  role: z.enum(ROLES),
  position: z.string().min(1).max(120),
  hire_date: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    let query = supabaseAdmin.from("staff").select(
      "id, full_name, email, phone, branch, role, position, status, hire_date, created_at, updated_at"
    );
    // Branch isolation for non-managers.
    const branch = branchFilterFor(auth.user);
    if (branch) query = query.eq("branch", branch);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.error("[staff] fetch error:", error);
      return internalError("Failed to fetch staff.");
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[staff] unexpected error:", err);
    return internalError();
  }
}

// Creating staff is manager-only. Previously any authenticated branch user
// could call this endpoint and grant themselves role: "manager" — a clear
// privilege-escalation path.
export async function POST(request: NextRequest) {
  const auth = await requireRole(request, "manager");
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, createStaffSchema);
  if (!body.ok) return body.response;
  const {
    full_name,
    email,
    phone,
    branch,
    role,
    position,
    hire_date,
    password,
  } = body.data;

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("staff")
      .insert({
        full_name,
        email: email.toLowerCase(),
        phone,
        branch,
        role,
        position,
        hire_date: hire_date || new Date().toISOString().split("T")[0],
        status: "active",
        password_hash,
      })
      .select(
        "id, full_name, email, phone, branch, role, position, status, hire_date, created_at"
      )
      .single();

    if (error) {
      console.error("[staff] insert error:", error);
      return internalError("Failed to create staff member.");
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[staff] unexpected error:", err);
    return internalError();
  }
}
