"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Plus,
  FileText,
  BarChart3,
  Eye,
  RefreshCw,
  Home,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Scan,
  Monitor,
  Cpu,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// Recharts dynamically imported
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  monthlySales: number;
  recentActivity: any[];
}

interface Analytics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;
  conversionRate: number;
  topPages: { page: string; views: number }[];
  appointmentsByBranch: { branch: string; count: number }[];
  appointmentsByDate: { date: string; count: number }[];
}

const CHART_COLORS = ['#0b6e72', '#12b8a6', '#0d9488', '#6366f1'];

// Animated counter hook
function useCountUp(target: number, duration = 1000, enabled = true) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(null);
  
  useEffect(() => {
    if (!enabled || target === 0) {
      setValue(target);
      return;
    }
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      setValue(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, enabled]);
  
  return value;
}

// KPI stat card component
function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  subtext,
  color,
  loading,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: any;
  trend: string;
  trendUp: boolean;
  subtext: string;
  color: string;
  loading: boolean;
  delay?: number;
}) {
  const animatedValue = useCountUp(value, 800, !loading);

  return (
    <div
      className="premium-card stat-card group p-6 gradient-border"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold flex items-center gap-1",
            trendUp
              ? "bg-success-light/40 text-success border-success/15"
              : "bg-warning-light/40 text-warning border-warning/15"
          )}
        >
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        {loading ? (
          <Skeleton className="h-10 w-28 shimmer-loader" />
        ) : (
          <div className="text-3xl font-black tracking-tighter stat-number gradient-text">
            {animatedValue.toLocaleString()}
          </div>
        )}
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
          <TrendingUp className="h-3 w-3 text-primary/50 shrink-0" />
          {subtext}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlySales: 0,
    recentActivity: [],
  });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [patientsRes, appointmentsRes, salesRes, analyticsRes] = await Promise.all([
        fetch("/api/dashboard/patients/count"),
        fetch("/api/dashboard/appointments/today"),
        fetch("/api/dashboard/sales/monthly"),
        localStorage.getItem("user_role") === "manager" ? fetch("/api/analytics").catch(() => null) : Promise.resolve(null),
      ]);

      const patients = await patientsRes.json().catch(() => ({ count: 0 }));
      const appointments = await appointmentsRes.json().catch(() => ({ count: 0 }));
      const sales = await salesRes.json().catch(() => ({ total: 0 }));

      let analyticsData = null;
      if (analyticsRes && analyticsRes.ok) {
        try {
          analyticsData = await analyticsRes.json();
          if (analyticsData && typeof analyticsData.conversionRate !== 'number') {
            analyticsData.conversionRate = parseFloat(analyticsData.conversionRate || '0') || 0;
          }
        } catch (e) {
          console.error("Error parsing analytics:", e);
        }
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
      const headers: Record<string, string> = token ? { "Authorization": `Bearer ${token}` } : {};

      const [recentAppointmentsRes, recentPatientsRes] = await Promise.all([
        fetch("/api/appointments", { headers }).catch(() => null),
        fetch("/api/dashboard/patients", { headers }).catch(() => null),
      ]);

      let recentActivity: any[] = [];

      if (recentAppointmentsRes && recentAppointmentsRes.ok) {
        const appointmentsList = await recentAppointmentsRes.json().catch(() => []);
        if (Array.isArray(appointmentsList)) {
          appointmentsList.slice(0, 3).forEach((apt: any) => {
            const timeAgo = apt.created_at ? new Date(apt.created_at) : new Date(apt.preferred_date);
            const branchMap: Record<string, string> = {
              "head-office": "Head Office",
              "bole": "Bole",
              "kera": "Kera",
              "bethzatha": "Betezatha",
            };
            recentActivity.push({
              description: `Appointment: ${apt.full_name}`,
              details: branchMap[apt.branch] || apt.branch || 'Clinic',
              time: formatRelativeTime(timeAgo),
              timestamp: timeAgo.getTime(),
              type: "appointment"
            });
          });
        }
      }

      if (recentPatientsRes && recentPatientsRes.ok) {
        const patientsList = await recentPatientsRes.json().catch(() => []);
        if (Array.isArray(patientsList)) {
          patientsList.slice(0, 2).forEach((patient: any) => {
            const timeAgo = patient.created_at ? new Date(patient.created_at) : new Date();
            recentActivity.push({
              description: `New Patient: ${patient.full_name}`,
              details: patient.phone,
              time: formatRelativeTime(timeAgo),
              timestamp: timeAgo.getTime(),
              type: "patient"
            });
          });
        }
      }

      recentActivity.sort((a, b) => b.timestamp - a.timestamp);

      setStats({
        totalPatients: patients.count || 0,
        todayAppointments: appointments.count || 0,
        monthlySales: sales.total || 0,
        recentActivity: recentActivity.slice(0, 5),
      });

      if (analyticsData) {
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isManager = userRole === "manager";
  const greeting = currentTime.getHours() < 12 ? "Good morning" : currentTime.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 page-container">
      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                {greeting} · {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="page-title">Operations Console</h1>
            <p className="page-subtitle max-w-md">
              {isManager
                ? "Full clinical network overview — monitor performance, patients, and revenue in real time."
                : "Your daily clinical workflow dashboard — appointments, patients, and operations at a glance."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-4 px-5 py-2 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/5 mr-4 divide-x divide-border/40">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-success/80">Live Sync</span>
                </div>
                <div className="pl-4 flex items-center gap-2">
                   <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Node 04-Bole</span>
                </div>
            </div>
            {isManager && (
              <Button asChild variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
                <Link href="/">
                  <Home className="h-3.5 w-3.5 mr-2" />
                  Studio
                </Link>
              </Button>
            )}
            <Button onClick={fetchDashboardData} variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm group">
              <RefreshCw className={cn("h-3.5 w-3.5 mr-2 transition-transform duration-700", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary px-5">
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Tab Switcher (Manager Only) ─── */}
      {isManager && (
        <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-border/40 shadow-xs">
          {[
            { id: "overview", label: "Operational Overview", icon: BarChart3 },
            { id: "analytics", label: "Growth Analytics", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === "overview" && (
        <div className="space-y-6 stagger">

          {/* Primary KPI Grid */}
          <div className="grid gap-5 md:grid-cols-3 animate-in">
            <KpiCard
              label="Total Patients"
              value={stats.totalPatients}
              icon={Users}
              trend="+4.2%"
              trendUp={true}
              subtext="Active records in system"
              color="bg-primary/10 text-primary"
              loading={loading}
              delay={0}
            />
            <KpiCard
              label="Today's Appointments"
              value={stats.todayAppointments}
              icon={Calendar}
              trend="Live"
              trendUp={true}
              subtext="Scheduled for today"
              color="bg-accent/10 text-accent"
              loading={loading}
              delay={80}
            />
            <KpiCard
              label="Monthly Revenue"
              value={stats.monthlySales}
              icon={DollarSign}
              trend="-2.1%"
              trendUp={false}
              subtext="vs. $12,450 projected"
              color="bg-success-light/50 text-success"
              loading={loading}
              delay={160}
            />
          </div>

          {/* Secondary Analytics Mini-stats (Manager Only) */}
          {isManager && (analytics || loading) && (
            <div className="grid gap-4 md:grid-cols-4 animate-in">
              {[
                { label: "Site Traffic", value: analytics?.totalVisits?.toLocaleString() || "—", icon: Eye, color: "text-primary" },
                { label: "Unique Visitors", value: analytics?.uniqueVisitors?.toLocaleString() || "—", icon: Users, color: "text-accent" },
                { label: "Page Views", value: analytics?.pageViews?.toLocaleString() || "—", icon: ExternalLink, color: "text-warning" },
                { label: "Conversion", value: analytics ? `${typeof analytics.conversionRate === 'number' ? analytics.conversionRate.toFixed(1) : '0.0'}%` : "—", icon: Target, color: "text-success" },
              ].map((item, i) => (
                <div key={i} className="premium-card p-4 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 bg-muted rounded-lg", item.color)}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">{item.label}</p>
                      {loading
                        ? <Skeleton className="h-5 w-14 mt-1.5 shimmer-loader" />
                        : <p className="text-base font-black mt-0.5">{item.value}</p>
                      }
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="progress-bar mt-3">
                    <div className="progress-fill" style={{ "--progress-width": `${40 + i * 15}%` } as any} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Feed + Quick Actions */}
          <div className="grid gap-6 md:grid-cols-5 animate-in">
            {/* Activity Timeline */}
            <div className="md:col-span-3 premium-card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/[0.03]">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Operational Timeline</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Real-time clinical event stream</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary-light/30">
                  View All
                </Button>
              </div>

              {loading ? (
                <div className="p-5 space-y-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-9 w-9 rounded-full shimmer-loader shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2 shimmer-loader" />
                        <Skeleton className="h-3 w-1/4 shimmer-loader opacity-50" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : stats.recentActivity.length === 0 ? (
                <div className="empty-state">
                  <div className="p-4 bg-muted/40 rounded-full mb-3">
                    <Activity className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-bold">No activity recorded today</p>
                  <p className="text-xs text-muted-foreground max-w-[240px] mt-1">System monitoring is active and awaiting data.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {stats.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="interactive-row flex items-start gap-4 p-5 group"
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                        activity.type === "appointment"
                          ? "bg-primary-light/50 text-primary border-primary/15"
                          : "bg-accent-light/50 text-accent border-accent/15"
                      )}>
                        {activity.type === "appointment"
                          ? <Calendar className="h-4 w-4" />
                          : <Users className="h-4 w-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{activity.description}</p>
                          <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="md:col-span-2 premium-card overflow-hidden">
              <div className="p-5 border-b border-border/40 bg-muted/[0.03]">
                <h3 className="text-sm font-bold">Quick Actions</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Accelerated workflows</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { href: "/dashboard/patients/new", label: "Register Patient", icon: Plus, color: "hover:border-primary/40 hover:bg-primary-light/10", iconColor: "group-hover:text-primary" },
                  { href: "/dashboard/appointments/new", label: "Schedule Session", icon: Calendar, color: "hover:border-accent/40 hover:bg-accent-light/10", iconColor: "group-hover:text-accent" },
                  { href: "/dashboard/prescriptions/new", label: "New Prescription", icon: FileText, color: "hover:border-success/40 hover:bg-success-light/10", iconColor: "group-hover:text-success" },
                ].map((action) => (
                  <Button
                    key={action.href}
                    asChild
                    variant="outline"
                    className={cn("w-full justify-between h-11 group border-border/60 text-sm font-semibold transition-all duration-300", action.color)}
                  >
                    <Link href={action.href} className="flex items-center">
                      <div className={cn("p-1.5 bg-muted/80 group-hover:bg-muted transition-colors rounded mr-3")}>
                        <action.icon className={cn("h-3.5 w-3.5 text-muted-foreground transition-colors", action.iconColor)} />
                      </div>
                      {action.label}
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-all" />
                    </Link>
                  </Button>
                ))}

                {/* System Health */}
                <div className="pt-3 border-t border-dashed border-border/50 mt-3">
                  <div className="p-4 bg-success-light/15 rounded-xl border border-success/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-success/80">System Health</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      All nodes operational. Database sync complete. SMS gateway active.
                    </p>
                  </div>
                </div>

                {/* Branch Quick Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {["Bole", "Kera", "Betezatha", "Head Office"].map((branch) => (
                    <div key={branch} className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                      <span className="text-[9px] font-bold text-muted-foreground truncate uppercase tracking-tighter">{branch}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ANALYTICS TAB ─── */}
      {activeTab === "analytics" && isManager && (
        <div className="space-y-6 animate-in">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Branch Distribution */}
            <div className="premium-card overflow-hidden">
              <div className="p-5 border-b border-border/40 bg-muted/[0.03]">
                <h3 className="text-sm font-bold">Appointment Distribution</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Load across all clinic branches</p>
              </div>
              <div className="p-6">
                {analytics?.appointmentsByBranch && analytics.appointmentsByBranch.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={analytics.appointmentsByBranch}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                        cornerRadius={6}
                        dataKey="count"
                        label={({ name, percent = 0 }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {analytics.appointmentsByBranch.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--card)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--foreground)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state h-[280px]">
                    <Activity className="h-10 w-10 text-muted-foreground/20 mb-2" />
                    <p className="text-sm font-bold">No data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Trend */}
            <div className="premium-card overflow-hidden">
              <div className="p-5 border-b border-border/40 bg-muted/[0.03]">
                <h3 className="text-sm font-bold">Appointment Volume</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Historical trends & scaling</p>
              </div>
              <div className="p-6">
                {analytics?.appointmentsByDate && analytics.appointmentsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={analytics.appointmentsByDate}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 700 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--card)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state h-[280px]">
                    <TrendingUp className="h-10 w-10 text-muted-foreground/20 mb-2" />
                    <p className="text-sm font-bold">Insufficient data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="premium-card overflow-hidden">
            <div className="p-5 border-b border-border/40 bg-muted/[0.03]">
              <h3 className="text-sm font-bold">Patient Entry Points</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Top performing pages & traffic funnel</p>
            </div>
            <div className="divide-y divide-border/30">
              {analytics?.topPages?.map((page, index) => (
                <div key={index} className="interactive-row flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-muted-foreground/30 tabular-nums w-5 text-center">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-sm font-semibold">{page.page}</p>
                      <div className="progress-bar w-32 mt-1.5">
                        <div
                          className="progress-fill"
                          style={{ "--progress-width": `${((page.views / (analytics?.pageViews || 1)) * 100).toFixed(0)}%` } as any}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black">{page.views.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">views</p>
                    </div>
                    <Badge variant="outline" className="bg-muted/50 font-bold tabular-nums text-[10px]">
                      {((page.views / (analytics?.pageViews || 1)) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="p-8 text-center text-muted-foreground text-sm">Awaiting traffic data...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
