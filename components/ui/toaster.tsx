"use client";

import { Toaster as SonnerToaster } from "sonner";

// Themed toast root. Mounted once at the app layout so any client component
// can call `toast.success(...) / toast.error(...)` from anywhere.
//
// Replaces the previous `window.alert(...)` pattern used across the dashboard.
// Toasts are accessible (Sonner uses an aria-live region under the hood) and
// non-blocking, which is the point.
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
}
