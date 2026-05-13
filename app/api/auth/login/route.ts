import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  signSession,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth/jwt";
import {
  unauthorized,
  forbidden,
  internalError,
} from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  expectedBranch: z.string().optional().nullable(),
});

// Public-facing copy is intentionally generic — we do not leak which of
// "email" / "password" / "role" failed. Internal logs keep the detail.
const GENERIC_INVALID_CREDENTIALS = "Invalid email or password";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request, loginSchema);
  if (!body.ok) return body.response;

  const { email, password, expectedBranch } = body.data;

  try {
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, email, role, branch, full_name, password_hash, status")
      .eq("email", email.toLowerCase())
      .single();

    if (staffError || !staff) {
      // Don't distinguish unknown-user from wrong-password.
      console.error("[login] lookup failed:", staffError?.message);
      return unauthorized(GENERIC_INVALID_CREDENTIALS);
    }

    if (staff.status && staff.status !== "active") {
      return forbidden("This account is not active. Please contact the manager.");
    }

    // Branch / role gate — the login page passes this so a staff URL can't
    // be used to log in as a manager (and vice versa). We still check role
    // server-side; never trust the client's expectedBranch.
    if (expectedBranch === "manager" && staff.role !== "manager") {
      return forbidden("Manager credentials required for this portal.");
    }
    if (
      expectedBranch &&
      expectedBranch !== "manager" &&
      staff.branch !== expectedBranch
    ) {
      return forbidden("This account does not belong to this branch.");
    }

    // Password verification with on-the-fly upgrade for legacy plaintext.
    let passwordValid = false;
    if (staff.password_hash) {
      const isBcryptHash = /^\$2[ayb]\$/.test(staff.password_hash);
      if (isBcryptHash) {
        passwordValid = await bcrypt.compare(password, staff.password_hash);
      } else if (password === staff.password_hash) {
        passwordValid = true;
        const upgraded = await bcrypt.hash(password, 10);
        await supabaseAdmin
          .from("staff")
          .update({ password_hash: upgraded })
          .eq("id", staff.id);
      }
    }

    if (!passwordValid) {
      return unauthorized(GENERIC_INVALID_CREDENTIALS);
    }

    const token = signSession({
      id: staff.id,
      email: staff.email,
      role: staff.role,
      branch: staff.branch,
    });

    // Return only the safe profile fields — no token, no password hash, no
    // internal flags. The session is delivered exclusively through the
    // HTTP-only cookie below.
    const response = NextResponse.json({
      user: {
        id: staff.id,
        email: staff.email,
        role: staff.role,
        branch: staff.branch,
        name: staff.full_name,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[login] unexpected error:", err);
    return internalError("Authentication failed unexpectedly.");
  }
}
