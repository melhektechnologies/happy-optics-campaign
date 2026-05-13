import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/jwt";

// Always-allowed: idempotent, no body. Clears the session cookie with the
// same attributes used at set-time so the browser actually deletes it.
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
