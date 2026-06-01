"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  Home,
  ChevronLeft,
  ChevronRight,
  Search,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const managerGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard/manager", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/manager/patients", label: "Patients", icon: Users },
      { href: "/dashboard/manager/appointments", label: "Appointments", icon: Calendar },
      { href: "/dashboard/manager/prescriptions", label: "Prescriptions", icon: FileText },
      { href: "/dashboard/manager/sales", label: "Sales", icon: ShoppingCart },
    ]
  },
  {
    label: "Administration",
    items: [
      { href: "/dashboard/manager/staff", label: "Staff", icon: UserCog },
      { href: "/dashboard/manager/settings", label: "Settings", icon: Settings },
    ]
  }
];

export default function ManagerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    const email = localStorage.getItem("user_email") || "";
    const savedCollapsed = localStorage.getItem("sidebar_collapsed_manager") === "true";
    setUserRole(role);
    setUserEmail(email);
    setIsCollapsed(savedCollapsed);

    if (!role || role !== "manager") {
      router.push("/auth/login/manager");
      return;
    }
  }, [router]);

  const toggleSidebarCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar_collapsed_manager", String(nextState));
  };

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_branch");
    router.push("/auth/login/manager");
  };

  if (userRole !== "manager") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Loading portal...</p>
      </div>
    );
  }

  // Simple Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      return { href, label };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-muted/20 text-foreground transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo Section */}
            <div className={cn(
              "flex h-16 items-center border-b border-border px-4",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              <Link href="/" className="flex items-center gap-3 overflow-hidden">
                <div className="relative h-8 w-8 min-w-[32px]">
                  <Image
                    src="/brand/happy-optics-logo.png"
                    alt="Happy Optics Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col whitespace-nowrap transition-opacity duration-300">
                    <span className="text-sm font-bold tracking-tight text-foreground">Happy Optics</span>
                    <span className="text-[10px] text-primary font-medium tracking-wide">Manager Portal</span>
                  </div>
                )}
              </Link>
              {!isCollapsed && (
                <button 
                  onClick={toggleSidebarCollapse}
                  className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground hidden lg:block"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 space-y-4 p-3 overflow-y-auto">
              {managerGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  {!isCollapsed ? (
                    <h3 className="px-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {group.label}
                    </h3>
                  ) : (
                    <div className="h-2 border-b border-border/50 my-2 mx-1" />
                  )}
                  <nav className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          title={isCollapsed ? item.label : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative group",
                            isActive
                              ? "bg-gradient-to-r from-primary/12 to-primary/2 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-105", isActive && "text-primary")} />
                          {!isCollapsed && (
                            <span className="whitespace-nowrap transition-opacity duration-300">
                              {item.label}
                            </span>
                          )}
                          {/* Active glowing indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-primary shadow-[0_0_8px_var(--primary)]" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* User Info / Actions */}
          <div className="border-t border-border p-3 space-y-2">
            {!isCollapsed ? (
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">Manager account</p>
                    <p className="text-xs font-semibold text-foreground truncate">{userEmail || "manager@happyoptics.com"}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 border-t border-border/50 pt-3">
                  <Button variant="outline" className="w-full h-7 text-[10px]" size="sm" asChild>
                    <Link href="/">
                      <Home className="mr-1.5 h-3.5 w-3.5" />
                      View Website
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full h-7 text-[10px] text-muted-foreground hover:text-destructive justify-center" 
                    size="sm" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-1.5 h-3.5 w-3.5" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleSidebarCollapse}
                  className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground hidden lg:block"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="rounded-md p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Body */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Contextual Breadcrumbs */}
            <nav className="hidden sm:flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Link href="/dashboard/manager" className="hover:text-foreground transition-colors">Portal</Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center space-x-1.5">
                  <span>/</span>
                  <Link 
                    href={crumb.href} 
                    className={cn(
                      "hover:text-foreground transition-colors",
                      idx === breadcrumbs.length - 1 && "text-foreground font-medium pointer-events-none"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-4">
            {/* Search shortcut / command prompt style button */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search console... (Cmd+K)"
                disabled
                className="h-9 w-48 rounded-lg border border-border bg-muted/50 pl-8 pr-3 text-xs focus-visible:outline-none opacity-80 cursor-not-allowed"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold uppercase">
                Manager
              </span>
              <span className="text-xs text-muted-foreground hidden lg:inline max-w-[120px] truncate">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

