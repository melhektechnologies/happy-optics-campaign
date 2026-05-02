"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Boxes, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  PackageSearch, 
  Settings, 
  ShoppingCart, 
  Store, 
  Users 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Terminal", href: "/dashboard/pos", icon: ShoppingCart },
  { name: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { name: "Products", href: "/dashboard/products", icon: PackageSearch },
  { name: "Branches", href: "/dashboard/branches", icon: Store },
  { name: "Staff & Users", href: "/dashboard/users", icon: Users },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-[60px] items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#010133]">
          <ShoppingCart className="h-6 w-6 text-[#012a2d]" />
          <span>SuperNova</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group ${
                  isActive 
                    ? "bg-nova-pink text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[1.02]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-nova-pink"}`} />
                <span className="font-bold tracking-tight">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10 border-2 border-slate-100">
            <AvatarImage src="/avatar.png" alt="Admin" />
            <AvatarFallback className="bg-[#010133] text-white">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#010133]">Admin User</span>
            <span className="text-xs text-slate-500">Super Admin</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[260px_1fr] bg-obsidian-950 premium-grid selection:bg-nova-pink/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-20">
        <div className="h-full nova-glass border-r border-white/5 m-4 rounded-3xl overflow-hidden animate-nova-entry">
          <SidebarContent />
        </div>
      </div>

      <div className="flex flex-col relative z-10">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 px-6 lg:hidden nova-glass m-4 rounded-2xl border-white/5">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0 bg-obsidian-900 border-white/10">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 font-black text-lg text-white">
            <ShoppingCart className="h-5 w-5 text-nova-pink" />
            <span className="tracking-tighter">SuperNova</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl animate-nova-entry">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
