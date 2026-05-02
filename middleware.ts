import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/appointments") || // Public appointment submission
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Protect dashboard and internal API routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard") || pathname.startsWith("/api/analytics")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const url = new URL("/auth/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

