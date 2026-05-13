"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { clientLogout } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const staffNavItems = [
  { href: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BranchDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const branch = params.branch as string;
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  // Branch routing decisions happen reactively as the user state resolves.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push(`/auth/login/${branch}`);
      return;
    }
    if (user.role === "manager") {
      router.push("/dashboard/manager");
      return;
    }
    if (user.branch !== branch) {
      router.push(`/dashboard/${user.branch}`);
    }
  }, [loading, user, branch, router]);

  const handleSignOut = async () => {
    await clientLogout();
    router.push(`/auth/login/${branch}`);
  };

  if (loading || !user || user.branch !== branch || user.role === "manager") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const userRole = user.role;
  const userEmail = user.email;
  const userBranch = user.branch;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Title */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="relative h-8 w-8">
              <Image
                src="/brand/happy-optics-logo.png"
                alt="Happy Optics Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold">Happy Optics</h1>
              <p className="text-xs text-muted-foreground">{userBranch}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {staffNavItems.map((item) => {
              const Icon = item.icon;
              const href = `/dashboard/${branch}${item.href}`;
              const isActive = typeof window !== "undefined" && window.location.pathname === href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Sign Out */}
          <div className="border-t border-border p-4">
            <div className="mb-3 rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium">{userEmail || "Loading..."}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Branch: <span className="font-medium capitalize">{userBranch}</span>
              </p>
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {userEmail || "Loading..."}
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">
              {userBranch}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

