import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Server configuration error: Supabase is not configured. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables." },
        { status: 500 }
      );
    }

    const { email, password, expectedBranch } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists in staff table
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (staffError) {
      console.error("Database error:", staffError);
      console.error("Error code:", staffError.code);
      console.error("Error details:", JSON.stringify(staffError, null, 2));
      
      // Provide more helpful error messages
      if (staffError.code === "PGRST116" || staffError.message?.includes("relation") || staffError.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: "Staff table does not exist. Please run the database schema SQL to create the staff table." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Database error: ${staffError.message || "Unknown error"}. Please check your Supabase configuration and ensure the staff table exists.` },
        { status: 500 }
      );
    }

    if (!staff) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Validate manager login
    if (expectedBranch === "manager" && staff.role !== "manager") {
      return NextResponse.json(
        { error: "This account is not authorized as a manager" },
        { status: 403 }
      );
    }

    // Validate branch if expectedBranch is provided (staff login)
    if (expectedBranch && expectedBranch !== "manager" && staff.branch !== expectedBranch) {
      return NextResponse.json(
        { error: "You do not have access to this branch" },
        { status: 403 }
      );
    }

    // Check password using bcrypt
    let passwordValid = false;

    if (staff.password_hash) {
      // Check if password_hash is a valid bcrypt hash (starts with $2a$, $2b$, or $2y$)
      const isBcryptHash = /^\$2[ayb]\$/.test(staff.password_hash);
      
      if (isBcryptHash) {
        // Valid bcrypt hash - compare normally
        passwordValid = await bcrypt.compare(password, staff.password_hash);
      } else {
        // Plain text password stored (legacy/migration issue) - compare directly
        // Then update to bcrypt hash
        if (password === staff.password_hash) {
          passwordValid = true;
          // Update to bcrypt hash
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          await supabaseAdmin
            .from("staff")
            .update({ password_hash: hashedPassword })
            .eq("id", staff.id);
        } else {
          passwordValid = false;
        }
      }
    } else {
      // Security: Do not allow setting password on first login in production
      return NextResponse.json(
        { error: "Account not fully set up. Please contact the administrator." },
        { status: 403 }
      );
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
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

    // Set HTTP-only cookie for security
    const response = NextResponse.json({
      success: true,
      role: staff.role,
      email: staff.email,
      branch: staff.branch,
      name: staff.full_name,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Full error details:", errorMessage);
    
    // Check if it's a fetch/network error
    if (errorMessage.includes("fetch failed") || errorMessage.includes("ECONNREFUSED") || errorMessage.includes("network")) {
      return NextResponse.json(
        { error: "Cannot connect to database. Please check your Supabase configuration and environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 500 }
      );
    }
    
    // Check if it's a missing environment variable
    if (errorMessage.includes("Missing") || errorMessage.includes("environment variable")) {
      return NextResponse.json(
        { error: "Server configuration error. Please check environment variables are set correctly." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Login failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

