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
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Bell,
  HelpCircle,
  Zap,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const managerGroups: NavGroup[] = [
  {
    label: "Main Console",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/patients", label: "Patient Registry", icon: Users },
      { href: "/dashboard/appointments", label: "Calendar", icon: Calendar },
    ]
  },
  {
    label: "Operations",
    items: [
      { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
      { href: "/dashboard/sales", label: "Finance & Sales", icon: ShoppingCart },
    ]
  },
  {
    label: "Administration",
    items: [
      { href: "/dashboard/staff", label: "Team Access", icon: UserCog },
      { href: "/dashboard/settings", label: "Configuration", icon: Settings },
    ]
  }
];

const staffGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
      { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
    ]
  },
  {
    label: "Preferences",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    const email = localStorage.getItem("user_email") || "";
    const savedCollapsed = localStorage.getItem("sidebar_collapsed") === "true";
    setUserRole(role);
    setUserEmail(email);
    setIsCollapsed(savedCollapsed);

    if (!role) {
      router.push("/auth/login");
    }
  }, [router]);

  const toggleSidebarCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar_collapsed", String(nextState));
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    router.push("/auth/login");
  };

  if (pathname?.startsWith("/dashboard/manager")) {
    return <>{children}</>;
  }

  const groups = (userRole === "manager") ? managerGroups : staffGroups;

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace("-", " ");
      return { href, label };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* ─── Premium Sidebar ─── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border/60 bg-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
          isCollapsed ? "w-[72px]" : "w-64",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
        style={{ background: "linear-gradient(180deg, var(--card) 0%, color-mix(in srgb, var(--card) 97%, var(--primary)) 100%)" }}
      >
        <div className="flex h-full flex-col">
          {/* ─── Brand Header ─── */}
          <div className={cn(
            "flex h-[72px] items-center border-b border-border/40 relative overflow-hidden",
            isCollapsed ? "px-0 justify-center" : "px-5"
          )}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent pointer-events-none" />
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-9 w-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/brand/happy-optics-logo.png"
                  alt="Logo"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col select-none overflow-hidden">
                  <span className="text-sm font-extrabold tracking-tight text-foreground leading-none">HAPPY OPTICS</span>
                  <span className="text-[9px] font-bold text-primary mt-1 tracking-[0.18em] uppercase opacity-80">Console v2.0</span>
                </div>
              )}
            </Link>
          </div>

          {/* ─── Navigation ─── */}
          <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-none">
            {groups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {!isCollapsed ? (
                  <h3 className="px-3 mb-2 text-[9px] font-black tracking-[0.15em] text-muted-foreground/50 uppercase">
                    {group.label}
                  </h3>
                ) : (
                  <div className="h-px bg-border/30 mx-2 my-3" />
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
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 outline-none",
                          isActive
                            ? "sidebar-active text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                          isCollapsed && "justify-center px-0"
                        )}
                      >
                        {isActive && <div className="nav-active-bar" />}
                        <Icon className={cn(
                          "shrink-0 transition-all duration-200",
                          isCollapsed ? "h-5 w-5" : "h-[17px] w-[17px]",
                          isActive ? "text-primary" : "group-hover:scale-110"
                        )} />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                        {item.badge && !isCollapsed && (
                          <span className="ml-auto text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        
                        {/* Tooltip when collapsed */}
                        {isCollapsed && (
                          <div className="tooltip">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* ─── Sidebar Footer ─── */}
          <div className="p-3 border-t border-border/40 space-y-2">
            {/* System health badge */}
            {!isCollapsed && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success-light/20 border border-success/10 mx-1">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-success/80">All Systems Operational</span>
              </div>
            )}

            {/* User profile section */}
            <div className={cn(
              "flex flex-col gap-2",
              isCollapsed && "items-center"
            )}>
              <div className={cn(
                "p-3 rounded-2xl bg-muted/30 border border-border/30",
                isCollapsed && "p-2 rounded-xl"
              )}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0">
                    {userInitials}
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden flex-1">
                      <p className="text-[11px] font-black text-foreground truncate leading-tight uppercase tracking-tight">{userRole || "User"}</p>
                      <p className="text-[9px] text-muted-foreground truncate opacity-70 mt-0.5">{userEmail}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 h-8 text-[10px] font-bold border-border/80 bg-card hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all"
                  >
                    <LogOut className="h-3 w-3 mr-1.5" />
                    Sign Out
                  </Button>
                )}
              </div>

              <Button
                onClick={toggleSidebarCollapse}
                variant="ghost"
                size="sm"
                className="hidden lg:flex w-full justify-center h-7 text-muted-foreground hover:text-foreground text-[9px] font-black uppercase tracking-widest"
              >
                {isCollapsed
                  ? <ChevronRight className="h-4 w-4" />
                  : <><ChevronLeft className="h-3.5 w-3.5 mr-1" /> Collapse</>
                }
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className={cn(
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen flex flex-col",
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
      )}>
        {/* ─── Top Header Bar ─── */}
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between px-5 lg:px-8 bg-background/90 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-muted-foreground rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Console</Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                  <Link
                    href={crumb.href}
                    className={cn(
                      "transition-colors",
                      idx === breadcrumbs.length - 1
                        ? "text-foreground font-black"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block">
              <CommandPalette />
            </div>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-4.5 w-4.5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 text-[8px] font-black bg-primary text-white rounded-full flex items-center justify-center border-2 border-background">
                  {notifications}
                </span>
              )}
            </Button>

            {/* Avatar */}
            <button className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-primary text-[11px] font-black hover:border-primary/40 hover:shadow-md transition-all">
              {userInitials}
            </button>
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <main className="flex-1 p-5 lg:p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>

        {/* ─── Footer ─── */}
        <footer className="py-4 px-8 border-t border-border/30 mt-auto">
          <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.25em] text-center">
            Happy Optics Console v2.0 · Optimized for Clinical Workflows · © 2026 Melhek Technologies
          </p>
        </footer>
      </div>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
