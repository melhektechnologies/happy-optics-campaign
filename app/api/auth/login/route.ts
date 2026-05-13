import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation Schema for Login
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  expectedBranch: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Infrastructure Validation
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Protocol Error: Central database node is offline." },
        { status: 500 }
      );
    }

    // 2. Payload Validation
    const body = await request.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation Failure: " + validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, expectedBranch } = validated.data;

    // 3. User Identity Retrieval
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (staffError) {
      console.error("[Auth] Database sync error:", staffError);
      return NextResponse.json(
        { error: "Identification Failure: The provided credentials do not match our secure records." },
        { status: 401 }
      );
    }

    if (!staff) {
      return NextResponse.json(
        { error: "Access Denied: Intelligence node not found." },
        { status: 401 }
      );
    }

    // 4. Role & Branch Authorization
    if (expectedBranch === "manager" && staff.role !== "manager") {
      return NextResponse.json(
        { error: "Authorization Protocol: Managerial clearance required." },
        { status: 403 }
      );
    }

    if (expectedBranch && expectedBranch !== "manager" && staff.branch !== expectedBranch) {
      return NextResponse.json(
        { error: "Authorization Protocol: Local branch clearance required." },
        { status: 403 }
      );
    }

    // 5. Secure Cryptographic Verification
    let passwordValid = false;

    if (staff.password_hash) {
      const isBcryptHash = /^\$2[ayb]\$/.test(staff.password_hash);
      
      if (isBcryptHash) {
        passwordValid = await bcrypt.compare(password, staff.password_hash);
      } else {
        // Legacy migration protocol
        if (password === staff.password_hash) {
          passwordValid = true;
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          await supabaseAdmin
            .from("staff")
            .update({ password_hash: hashedPassword })
            .eq("id", staff.id);
        }
      }
    } else {
      return NextResponse.json(
        { error: "Security Lock: Account setup incomplete. Please contact the security administrator." },
        { status: 403 }
      );
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Identification Failure: Invalid cryptographic sequence." },
        { status: 401 }
      );
    }

    // 6. Secure Token Generation
    const token = jwt.sign(
      {
        id: staff.id,
        email: staff.email,
        role: staff.role,
        branch: staff.branch,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Encrypted Response Packaging
    const response = NextResponse.json({
      success: true,
      role: staff.role,
      branch: staff.branch,
      name: staff.full_name,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Auth] Fatal process error:", error);
    return NextResponse.json(
      { error: "System Error: Authentication process desynchronized." },
      { status: 500 }
    );
  }
}


