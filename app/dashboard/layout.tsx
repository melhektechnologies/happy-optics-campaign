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
  Search,
  User as UserIcon,
  Bell,
  Command,
  HelpCircle,
  ChevronDown
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
    label: "Main Console",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/patients", label: "Patient Registry", icon: Users },
      { href: "/dashboard/appointments", label: "Calendar", icon: Calendar },
    ]
  },
  {
    label: "Operational Node",
    items: [
      { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
      { href: "/dashboard/sales", label: "Finance & Sales", icon: ShoppingCart },
    ]
  },
  {
    label: "System Intelligence",
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
      { href: "/dashboard/appointments", label: "Calendar", icon: Calendar },
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Premium Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 shadow-sm",
          isCollapsed ? "w-[72px]" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand/Logo Header */}
          <div className={cn(
            "flex h-20 items-center px-6 border-b border-border/50",
            isCollapsed && "px-0 justify-center"
          )}>
            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="relative h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center p-1.5 border border-primary/20">
                <Image
                  src="/brand/happy-optics-logo.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col select-none overflow-hidden animate-in">
                  <span className="text-sm font-extrabold tracking-tight text-foreground leading-none">HAPPY OPTICS</span>
                  <span className="text-[10px] font-bold text-primary mt-1 tracking-widest uppercase">Console v1.0</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-none">
            {groups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2">
                {!isCollapsed ? (
                  <h3 className="px-3 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase opacity-60">
                    {group.label}
                  </h3>
                ) : (
                  <div className="h-px bg-border/40 mx-2 mb-4" />
                )}
                <nav className="space-y-1">
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
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-[18px] w-[18px] transition-transform group-hover:scale-110", isActive && "text-primary")} />
                        {!isCollapsed && (
                          <span className="truncate animate-in whitespace-nowrap">{item.label}</span>
                        )}
                        {isActive && <div className="nav-active-bar" />}
                        
                        {isCollapsed && (
                          <div className="absolute left-14 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
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

          {/* Sidebar Footer / Profile */}
          <div className="p-3 border-t border-border/50">
            <div className={cn(
              "flex flex-col gap-2",
              isCollapsed && "items-center"
            )}>
               <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-foreground px-3 font-semibold text-xs",
                  isCollapsed && "justify-center px-0 h-10 w-10 rounded-xl"
                )}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {!isCollapsed && "Help & Support"}
              </Button>
              
              <div className={cn(
                "p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-3",
                isCollapsed && "p-2 rounded-xl"
              )}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-sm shrink-0">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden animate-in">
                      <p className="text-[11px] font-bold text-foreground truncate leading-tight uppercase tracking-tight">{userRole || "User"}</p>
                      <p className="text-[10px] text-muted-foreground truncate opacity-80 mt-0.5">{userEmail}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-[11px] font-bold border-border bg-card hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all shadow-xs"
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    Terminate Session
                  </Button>
                )}
              </div>
              
              <Button 
                onClick={toggleSidebarCollapse}
                variant="ghost" 
                className="hidden lg:flex w-full justify-center h-8 text-muted-foreground hover:text-foreground"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest"><ChevronLeft className="h-4 w-4" /> Collapse</div>}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-500 ease-in-out min-h-screen flex flex-col",
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
      )}>
        {/* Modern Command Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-6 lg:px-10 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 text-muted-foreground rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Breadcrumbs with chevron style */}
            <nav className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Console</Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  <Link 
                    href={crumb.href} 
                    className={cn(
                      "transition-colors",
                      idx === breadcrumbs.length - 1 ? "text-foreground font-black" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search Interface */}
            <div className="relative hidden md:flex items-center group">
              <Command className="absolute left-3.5 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Command Prompt (⌘K)"
                className="h-10 w-64 rounded-xl border border-border/80 bg-muted/40 pl-10 pr-3 text-xs font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-card outline-none transition-all placeholder:text-muted-foreground/60 shadow-xs"
              />
            </div>
            
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative text-muted-foreground hover:text-foreground">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background" />
               </Button>
               
               <div className="h-10 w-10 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors group overflow-hidden relative">
                  <UserIcon className="h-5 w-5" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
          {children}
        </main>
        
        <footer className="py-6 px-10 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40 border-t border-border/40 mx-10 mt-auto">
           Optimized for high-performance clinical workflows. Happy Optics © 2026.
        </footer>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
