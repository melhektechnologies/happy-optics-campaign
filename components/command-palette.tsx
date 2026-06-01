"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Users,
  Search,
  ShoppingCart,
  FileText,
  Activity,
  Plus,
  Shield,
  Command as CommandIcon,
  X,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const commands = [
    {
      group: "Core Infrastructure",
      items: [
        { icon: Activity, label: "Operations Console", sub: "Global system overview", path: "/dashboard", color: "text-primary" },
        { icon: Calendar, label: "Session Grid", sub: "Appointment synchronization", path: "/dashboard/appointments", color: "text-primary" },
        { icon: Users, label: "Patient Registry", sub: "Active biometric records", path: "/dashboard/patients", color: "text-primary" },
      ]
    },
    {
      group: "Fiscal Intelligence",
      items: [
        { icon: CreditCard, label: "Revenue Vault", sub: "Transactional flux monitoring", path: "/dashboard/sales", color: "text-accent" },
        { icon: FileText, label: "Refraction Ledger", sub: "Clinical diagnostic specification", path: "/dashboard/prescriptions", color: "text-accent" },
      ]
    },
    {
      group: "System Protocols",
      items: [
        { icon: Shield, label: "Security Settings", sub: "Operational parameters", path: "/dashboard/settings", color: "text-muted-foreground" },
        { icon: User, label: "Human Capital", sub: "Personnel provisioning", path: "/dashboard/staff", color: "text-muted-foreground" },
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      item.sub.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm shadow-xs group"
      >
        <Search className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="hidden sm:inline">Search Console</span>
        <kbd className="pointer-events-none hidden h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-sans text-[10px] font-medium opacity-100 sm:flex ml-4">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl bg-card/90 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[28px] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border/40 flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter diagnostic query or operational command..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-muted-foreground/40 h-10"
                />
                <button 
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[450px] p-2 space-y-4 no-scrollbar">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                      <h3 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        {group.group}
                      </h3>
                      {group.items.map((item, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => runCommand(() => router.push(item.path))}
                          className="w-full text-left group flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-primary/5 transition-all outline-none focus:bg-primary/5"
                        >
                          <div className={cn("p-2 rounded-xl bg-muted group-hover:bg-card transition-all", item.color)}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-foreground">{item.label}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 leading-tight mt-0.5">{item.sub}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center opacity-30 select-none">
                     <Search className="h-10 w-10 mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest">No matching operational nodes</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60">ENT</kbd>
                      Select
                   </div>
                   <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60">ESC</kbd>
                      Dismiss
                   </div>
                </div>
                <div className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">
                   Happy Optics Console Alpha
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
