"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Send,
  RefreshCw,
  Search,
  ArrowUpRight,
  MoreVertical,
  CalendarCheck,
  Activity,
  Filter,
  Users,
  Zap,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  branch: string;
  preferred_date: string;
  preferred_time: string;
  reason: string | null;
  is_unity_student: boolean;
  notes: string | null;
  created_at: string;
  reminder_sent?: boolean;
}

const branchNames: Record<string, string> = {
  "head-office": "Addis Ababa Stadium",
  "bole": "Bole Clinical Hub",
  "kera": "Kera Downtown",
  "bethzatha": "Betezatha Center",
};

const branchColors: Record<string, string> = {
  "head-office": "bg-violet-100 text-violet-700 border-violet-200",
  "bole": "bg-primary-light/60 text-primary border-primary/20",
  "kera": "bg-amber-100 text-amber-700 border-amber-200",
  "bethzatha": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const FILTERS = [
  { id: "all", label: "All Sessions" },
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "unity", label: "Unity Students" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [userBranch, setUserBranch] = useState<string>("");
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    const branch = localStorage.getItem("user_branch") || "";
    setUserRole(role);
    setUserBranch(branch);
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    toast(`Send reminder to ${appointment.full_name}?`, {
      description: `Phone: ${appointment.phone}`,
      action: {
        label: "Send Now",
        onClick: async () => {
          setSendingId(appointment.id);
          try {
            const response = await fetch("/api/appointments/reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appointmentId: appointment.id,
                phone: appointment.phone,
                name: appointment.full_name,
                date: appointment.preferred_date,
                time: appointment.preferred_time,
                branch: branchNames[appointment.branch],
              }),
            });
            const data = await response.json();
            if (data.success) {
              toast.success("Reminder sent successfully.");
              fetchAppointments();
            } else {
              toast.error(`Failed: ${data.message}`);
            }
          } catch {
            toast.error("Network error. Please try again.");
          } finally {
            setSendingId(null);
          }
        },
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((apt) => {
    if (userRole && userRole !== "manager" && apt.branch !== userBranch) return false;
    const matchesFilter =
      filter === "all" ||
      (filter === "today" && apt.preferred_date === today) ||
      (filter === "upcoming" && apt.preferred_date >= today) ||
      (filter === "unity" && apt.is_unity_student);
    const matchesSearch =
      apt.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm) ||
      apt.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const todayCount = appointments.filter(a => a.preferred_date === today).length;
  const upcomingCount = appointments.filter(a => a.preferred_date > today).length;
  const unityCount = appointments.filter(a => a.is_unity_student).length;

  return (
    <div className="space-y-7 page-container">

      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Patient Scheduling</span>
            </div>
            <h1 className="page-title">Appointment Calendar</h1>
            <p className="page-subtitle">Synchronized clinical sessions across all {Object.keys(branchNames).length} branches.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button onClick={fetchAppointments} variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm group">
              <RefreshCw className={cn("h-3.5 w-3.5 mr-2 transition-transform duration-700", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary">
              <Link href="/dashboard/appointments/new">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book Session
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Stats Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Booked", value: appointments.length, icon: Calendar, color: "text-primary bg-primary/10" },
          { label: "Today", value: todayCount, icon: Clock, color: "text-accent bg-accent/10" },
          { label: "Upcoming", value: upcomingCount, icon: Activity, color: "text-success bg-success-light/50" },
          { label: "Unity Students", value: unityCount, icon: Users, color: "text-warning bg-warning-light/50" },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">{stat.label}</p>
                <p className="text-xl font-black mt-0.5">{loading ? "—" : stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Filters + Search ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex p-1 bg-muted/40 rounded-xl border border-border/40 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 rounded-lg whitespace-nowrap",
                filter === f.id
                  ? "bg-card text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative group sm:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-card border-border/60 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* ─── Appointment Cards ─── */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="premium-card p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-xl shimmer-loader shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48 shimmer-loader" />
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-3 w-full shimmer-loader opacity-50" />
                    <Skeleton className="h-3 w-full shimmer-loader opacity-50" />
                    <Skeleton className="h-3 w-full shimmer-loader opacity-50" />
                  </div>
                </div>
                <Skeleton className="h-9 w-32 shimmer-loader" />
              </div>
            </div>
          ))
        ) : filteredAppointments.length === 0 ? (
          <div className="empty-state premium-card border-dashed py-20">
            <div className="p-5 bg-muted/40 rounded-full mb-4">
              <CalendarCheck className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-base font-bold mb-1">No sessions found</h3>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {searchTerm ? "Try adjusting your search." : "No appointments match this filter."}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment, idx) => {
            const aptDate = new Date(appointment.preferred_date + 'T00:00:00');
            const isToday = appointment.preferred_date === today;
            const isPast = appointment.preferred_date < today;

            return (
              <div
                key={appointment.id}
                className={cn(
                  "premium-card group hover:border-primary/25 transition-all duration-300",
                  isToday && "border-primary/30 bg-primary-light/[0.04]"
                )}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl" />
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Date column */}
                    <div className={cn(
                      "w-20 md:w-24 flex flex-col items-center justify-center p-4 border-r border-border/40 shrink-0",
                      isToday ? "bg-primary/[0.06]" : "bg-muted/[0.04]"
                    )}>
                      {isToday && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1 bg-primary/10 px-1.5 py-0.5 rounded-full">Today</span>
                      )}
                      <div className={cn("text-2xl font-black leading-none", isToday ? "text-primary" : "text-foreground")}>
                        {aptDate.getDate()}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                        {aptDate.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground/50 mt-0.5">
                        {aptDate.getFullYear()}
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold tracking-tight">{appointment.full_name}</h3>
                            {appointment.is_unity_student && (
                              <Badge className="bg-primary/15 text-primary border-primary/20 text-[9px] font-bold uppercase">
                                <Zap className="h-2.5 w-2.5 mr-0.5" /> Unity
                              </Badge>
                            )}
                            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase border", branchColors[appointment.branch])}>
                              {branchNames[appointment.branch]}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-bold border-border/60">
                              <Clock className="h-2.5 w-2.5 mr-1" />
                              {appointment.preferred_time}
                            </Badge>
                          </div>

                          <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <Phone className="h-3 w-3 text-primary/50 shrink-0" />
                              {appointment.phone}
                            </div>
                            {appointment.email && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground truncate">
                                <Mail className="h-3 w-3 text-primary/50 shrink-0" />
                                {appointment.email}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <Activity className="h-3 w-3 text-primary/50 shrink-0" />
                              {appointment.reason || "General Examination"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {appointment.reminder_sent ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-light/30 border border-success/15 text-[10px] font-bold text-success uppercase tracking-wider">
                              <CheckCircle2 className="h-3 w-3" /> Notified
                            </div>
                          ) : (
                            <Button
                              onClick={() => sendReminder(appointment)}
                              disabled={sendingId === appointment.id}
                              variant="outline"
                              size="sm"
                              className="h-9 border-border group-hover:border-primary/30 font-bold text-[10px] uppercase tracking-wider px-4"
                            >
                              <Send className={cn("h-3.5 w-3.5 mr-2 text-primary", sendingId === appointment.id && "animate-pulse")} />
                              {sendingId === appointment.id ? "Sending..." : "Notify"}
                            </Button>
                          )}
                          <Button variant="outline" size="icon" className="h-9 w-9 border-border group-hover:border-primary/30">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
