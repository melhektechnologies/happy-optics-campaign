"use client";

// Client-side helpers that wrap /api/auth/* endpoints. These exist so
// every component logs in/out the same way and we never repeat the
// fetch + cookie + redirect dance.

export async function clientLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Even if the network call fails, the in-browser state will be
    // gone after a hard navigation; carry on.
  }
}
