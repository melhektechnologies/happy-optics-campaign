import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/server";
import { unauthorized } from "@/lib/api/errors";

// Single source of truth for "who am I?" on the client.
//
// We hit the DB on each call to (a) include the user's display name and
// (b) catch the case where a session is still valid but the user has been
// deactivated or deleted — that should sign them out immediately on the
// next /me call.
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return unauthorized();

  const { data: staff } = await supabaseAdmin
    .from("staff")
    .select("id, email, role, branch, full_name, status")
    .eq("id", user.id)
    .single();

  if (!staff || (staff.status && staff.status !== "active")) {
    return unauthorized("Session no longer valid");
  }

  return NextResponse.json({
    user: {
      id: staff.id,
      email: staff.email,
      role: staff.role,
      branch: staff.branch,
      name: staff.full_name,
    },
  });
}
