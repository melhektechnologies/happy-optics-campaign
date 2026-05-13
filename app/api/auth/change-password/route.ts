import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";
import { internalError, notFound, unauthorized } from "@/lib/api/errors";
import { parseJsonBody, z } from "@/lib/api/validate";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(200, "New password is too long"),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request, changePasswordSchema);
  if (!body.ok) return body.response;
  const { currentPassword, newPassword } = body.data;

  try {
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, password_hash")
      .eq("id", auth.user.id)
      .single();

    if (staffError || !staff) return notFound("User not found");

    const valid = await bcrypt.compare(
      currentPassword,
      staff.password_hash || ""
    );
    if (!valid) return unauthorized("Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabaseAdmin
      .from("staff")
      .update({ password_hash: hashed })
      .eq("id", auth.user.id);

    if (updateError) {
      console.error("[change-password] update error:", updateError);
      return internalError("Failed to update password");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[change-password] unexpected error:", err);
    return internalError();
  }
}
