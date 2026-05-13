"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "manager" | "staff";
}

// Client-side gate. Server middleware already enforces auth on dashboard
// routes; this component exists for pages mounted via `app/` where we want
// a quick spinner before role mismatch redirects.
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const unauthenticated = !loading && !user;
  const wrongRole =
    !loading && !!user && requiredRole === "manager" && user.role !== "manager";

  useEffect(() => {
    if (unauthenticated) {
      router.push("/auth/login");
    } else if (wrongRole) {
      router.push("/auth/login/manager");
    }
  }, [unauthenticated, wrongRole, router]);

  if (loading || unauthenticated || wrongRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
