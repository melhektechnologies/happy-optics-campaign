import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request: NextRequest) {
  try {
    // Check cookie first (preferred)
    let token = request.cookies.get("auth_token")?.value;
    
    // Fallback to header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      token = authHeader?.replace("Bearer ", "");
    }

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}

