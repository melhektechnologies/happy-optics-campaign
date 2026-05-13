"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { clientLogout } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  ShoppingCart, 
  UserCog, 
  Settings,
  Menu,
  X,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const managerNavItems = [
  { href: "/dashboard/manager", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/manager/patients", label: "Patients", icon: Users },
  { href: "/dashboard/manager/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/manager/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/dashboard/manager/sales", label: "Sales", icon: ShoppingCart },
  { href: "/dashboard/manager/staff", label: "Staff", icon: UserCog },
  { href: "/dashboard/manager/settings", label: "Settings", icon: Settings },
];

export default function ManagerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const handleSignOut = async () => {
    await clientLogout();
    router.push("/auth/login/manager");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Server middleware will have redirected unauthenticated requests, but
  // we double-check role client-side: a non-manager who somehow lands on
  // /dashboard/manager should be sent home, not see the chrome.
  if (!user || user.role !== "manager") {
    router.push("/auth/login/manager");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  const userRole = user.role;
  const userEmail = user.email;

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
              <p className="text-xs text-muted-foreground">Manager Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {managerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
              {userRole && (
                <p className="text-xs text-muted-foreground mt-1">
                  Role: <span className="font-medium capitalize">{userRole}</span>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  View Website
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
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
            {userRole && (
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">
                {userRole}
              </span>
            )}
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

