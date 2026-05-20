import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Zod Validation Schema for Staff Creation
const staffSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  branch: z.enum(["head-office", "bole", "kera", "bethzatha"], {
    message: "Invalid branch location",
  }),
  role: z.enum(["manager", "optometrist", "receptionist", "technician", "sales"], {
    message: "Invalid role assigned",
  }),
  position: z.string().min(1, "Position is required"),
  hire_date: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication & Manager-Only Authorization
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden: Managerial clearance required to view staff records." },
        { status: 403 }
      );
    }

    // 2. Retrieve Staff Records
    const { data, error } = await supabaseAdmin
      .from("staff")
      .select("id, full_name, email, phone, branch, role, position, status, hire_date, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Staff API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to retrieve staff records." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("[Staff API] Fatal GET error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Secure Authentication & Manager-Only Authorization
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden: Managerial clearance required to create staff accounts." },
        { status: 403 }
      );
    }

    // 2. Payload Validation
    const body = await request.json();
    const validated = staffSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 3. Cryptographic Password Hashing
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    // 4. Database Sync insertion
    const { data: staff, error } = await supabaseAdmin
      .from("staff")
      .insert({
        full_name: data.full_name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        branch: data.branch,
        role: data.role,
        position: data.position,
        hire_date: data.hire_date || new Date().toISOString().split("T")[0],
        status: "active",
        password_hash,
      })
      .select("id, full_name, email, phone, branch, role, position, status, hire_date")
      .single();

    if (error) {
      console.error("[Staff API] Supabase insert error:", error);
      if (error.code === "23505") { // Unique violation
        return NextResponse.json(
          { error: "Conflict: A staff member with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Database synchronization failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("[Staff API] Fatal POST error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
