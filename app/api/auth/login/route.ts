import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation Schema — expectedBranch is nullable/optional for manager login
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  expectedBranch: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again shortly." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, expectedBranch } = validated.data;

    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (staffError || !staff) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Role & Branch Authorization
    // null/undefined expectedBranch = manager portal login
    if (!expectedBranch) {
      if (staff.role !== "manager") {
        return NextResponse.json(
          { error: "This account does not have manager access." },
          { status: 403 }
        );
      }
    } else if (expectedBranch === "manager") {
      if (staff.role !== "manager") {
        return NextResponse.json(
          { error: "This account does not have manager access." },
          { status: 403 }
        );
      }
    } else {
      // Branch staff login — verify branch match
      if (staff.branch !== expectedBranch) {
        return NextResponse.json(
          { error: "You do not have access to this branch." },
          { status: 403 }
        );
      }
    }

    // Password Verification
    let passwordValid = false;

    if (staff.password_hash) {
      const isBcryptHash = /^\$2[ayb]\$/.test(staff.password_hash);
      if (isBcryptHash) {
        passwordValid = await bcrypt.compare(password, staff.password_hash);
      } else {
        // Legacy plain-text — migrate to bcrypt on first login
        if (password === staff.password_hash) {
          passwordValid = true;
          const hashedPassword = await bcrypt.hash(password, 10);
          await supabaseAdmin
            .from("staff")
            .update({ password_hash: hashedPassword })
            .eq("id", staff.id);
        }
      }
    } else {
      return NextResponse.json(
        { error: "Account setup is incomplete. Please contact your administrator." },
        { status: 403 }
      );
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Generate JWT
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

    // Return token in JSON body (for localStorage) + set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      token,
      role: staff.role,
      branch: staff.branch,
      email: staff.email,
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
    console.error("[Auth] Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
