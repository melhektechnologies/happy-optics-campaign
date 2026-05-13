import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";

// Light cookie-only check used by the AuthGuard component to bounce
// unauthenticated users back to /auth/login. The actual identity payload
// lives at /api/auth/me.
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json(
      { valid: false, error: "Unauthorized", code: "unauthorized" },
      { status: 401 }
    );
  }
  return NextResponse.json({ valid: true });
}
