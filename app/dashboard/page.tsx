"use client";

import { useState, useEffect } from "react";
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
  ExternalLink
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

// Recharts dynamically imported to avoid SSR issues
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

const COLORS = ['#0b6e72', '#12b8a6', '#0d9488', '#131927'];

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

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    fetchDashboardData();
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

  return (
    <div className="space-y-8 page-container animate-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">Operations Console</h1>
          <p className="page-subtitle">
            {isManager ? "Managing global clinic infrastructure and patient performance." : "Monitoring your daily clinic workflow and appointments."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isManager && (
            <Button asChild variant="outline" size="sm" className="bg-card shadow-xs">
              <Link href="/">
                <Home className="h-3.5 w-3.5 mr-2" />
                Live Site
              </Link>
            </Button>
          )}
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="bg-card shadow-xs group">
            <RefreshCw className={cn("h-3.5 w-3.5 mr-2 transition-transform duration-500", loading && "animate-spin")} />
            Sync Results
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary-hover shadow-sm">
            <Plus className="h-3.5 w-3.5 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Modern Tab System */}
      {isManager && (
        <div className="flex p-1 bg-muted/60 rounded-xl w-fit border border-border/40">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2",
              activeTab === "overview" 
                ? "bg-card text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Operational Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2",
              activeTab === "analytics" 
                ? "bg-card text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Activity className="h-3.5 w-3.5" />
            Growth Analytics
          </button>
        </div>
      )}

      {/* Main Stats Grid */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="premium-card stat-card group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-success-light/30 text-success border-success/20 font-bold">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +4.2%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Patients</p>
                  {loading ? (
                    <Skeleton className="h-10 w-24 shimmer-loader" />
                  ) : (
                    <div className="text-3xl font-bold font-heading">{stats.totalPatients.toLocaleString()}</div>
                  )}
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span>Active records in database</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card stat-card group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-accent group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-primary-light/40 text-primary border-primary/20 font-bold">
                    Live
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Appointments</p>
                  {loading ? (
                    <Skeleton className="h-10 w-24 shimmer-loader" />
                  ) : (
                    <div className="text-3xl font-bold font-heading">{stats.todayAppointments}</div>
                  )}
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>Next patient expected in 45m</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card stat-card group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-success-light/30 rounded-xl text-success group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-warning-light/40 text-warning border-warning/20 font-bold">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2.1%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Sales</p>
                  {loading ? (
                    <Skeleton className="h-10 w-24 shimmer-loader" />
                  ) : (
                    <div className="text-3xl font-bold font-heading">${stats.monthlySales.toLocaleString()}</div>
                  )}
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-warning" />
                    <span>Compared to $12,450 projected</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isManager && (analytics || loading) && (
              <>
                <Card className="premium-card p-5 group hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site Traffic</p>
                      {loading ? <Skeleton className="h-5 w-16 mt-1 shimmer-loader" /> : <p className="text-lg font-bold">{analytics?.totalVisits?.toLocaleString() || 0}</p>}
                    </div>
                  </div>
                </Card>
                <Card className="premium-card p-5 group hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unique Reach</p>
                      {loading ? <Skeleton className="h-5 w-16 mt-1 shimmer-loader" /> : <p className="text-lg font-bold">{analytics?.uniqueVisitors?.toLocaleString() || 0}</p>}
                    </div>
                  </div>
                </Card>
                <Card className="premium-card p-5 group hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Page Views</p>
                      {loading ? <Skeleton className="h-5 w-16 mt-1 shimmer-loader" /> : <p className="text-lg font-bold">{analytics?.pageViews?.toLocaleString() || 0}</p>}
                    </div>
                  </div>
                </Card>
                <Card className="premium-card p-5 group hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conversion</p>
                      {loading ? <Skeleton className="h-5 w-16 mt-1 shimmer-loader" /> : (
                        <p className="text-lg font-bold">
                          {typeof analytics?.conversionRate === 'number' 
                            ? analytics.conversionRate.toFixed(1) 
                            : parseFloat(analytics?.conversionRate || '0').toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {/* Recent Activity Feed */}
            <Card className="premium-card md:col-span-3 overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Operational Timeline</CardTitle>
                    <p className="text-[11px] text-muted-foreground">Real-time system event stream</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary-hover hover:bg-primary-light/30">
                    View Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-9 w-9 rounded-full shimmer-loader shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/2 shimmer-loader" />
                          <Skeleton className="h-3 w-1/4 shimmer-loader opacity-60" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentActivity.length === 0 ? (
                  <div className="empty-state">
                    <div className="p-4 bg-muted/50 rounded-full mb-3">
                      <Activity className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-medium">No activity recorded today</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mt-1">System monitoring is active and awaiting data input.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-5 hover:bg-muted/5 transition-colors group">
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shrink-0 border border-border/60 transition-transform group-hover:scale-105",
                          activity.type === "appointment" ? "bg-primary-light/40 text-primary" : "bg-accent-light/40 text-accent"
                        )}>
                          {activity.type === "appointment" ? <Calendar className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold truncate text-foreground">{activity.description}</p>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Intelligence Panel */}
            <Card className="premium-card md:col-span-2 overflow-hidden border-teal-500/10">
              <CardHeader className="border-b border-border/50 bg-teal-500/[0.02] p-5">
                <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                <p className="text-[11px] text-muted-foreground">Accelerated operational workflows</p>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <Button asChild variant="outline" className="w-full justify-between h-11 group border-border/60 hover:border-primary/50 hover:bg-primary-light/10 text-sm font-medium transition-all duration-300">
                  <Link href="/dashboard/patients/new" className="flex items-center">
                    <div className="p-1.5 bg-muted group-hover:bg-primary-light/50 transition-colors rounded mr-3">
                      <Plus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    Register Patient
                    <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between h-11 group border-border/60 hover:border-accent/50 hover:bg-accent-light/10 text-sm font-medium transition-all duration-300">
                  <Link href="/dashboard/appointments/new" className="flex items-center">
                    <div className="p-1.5 bg-muted group-hover:bg-accent-light/50 transition-colors rounded mr-3">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    Schedule Appointment
                    <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between h-11 group border-border/60 hover:border-primary/50 hover:bg-primary-light/10 text-sm font-medium transition-all duration-300">
                  <Link href="/dashboard/prescriptions/new" className="flex items-center">
                    <div className="p-1.5 bg-muted group-hover:bg-primary-light/50 transition-colors rounded mr-3">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    Create Prescription
                    <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
                
                <div className="pt-4 border-t border-dashed border-border mt-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Health</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Intelligence nodes are active. All branches reporting operational stability. Database synchronization successful.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Analytics Tab (Manager Only) */}
      {activeTab === "analytics" && isManager && (
        <div className="space-y-6 animate-in">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="premium-card overflow-hidden">
              <CardHeader className="bg-muted/5 border-b border-border/50">
                <CardTitle className="text-base font-bold">Appointment Distribution</CardTitle>
                <p className="text-[11px] text-muted-foreground">Load balancing across all clinic nodes</p>
              </CardHeader>
              <CardContent className="p-6">
                {analytics?.appointmentsByBranch && analytics.appointmentsByBranch.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.appointmentsByBranch}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        cornerRadius={4}
                        dataKey="count"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {analytics.appointmentsByBranch.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <Activity className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium">Insufficient Data</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="premium-card overflow-hidden">
              <CardHeader className="bg-muted/5 border-b border-border/50">
                <CardTitle className="text-base font-bold">Appointment Volume</CardTitle>
                <p className="text-[11px] text-muted-foreground">Historical appointment trends & scaling</p>
              </CardHeader>
              <CardContent className="p-6">
                {analytics?.appointmentsByDate && analytics.appointmentsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.appointmentsByDate}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="var(--primary)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium">Insufficient Volume Data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Pages Analytics */}
          <Card className="premium-card">
             <CardHeader className="bg-muted/5 border-b border-border/50">
                <CardTitle className="text-base font-bold">Patient Entry Points</CardTitle>
                <p className="text-[11px] text-muted-foreground">High-performance funnel optimization</p>
              </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {analytics?.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-all">
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-bold text-muted-foreground/40 tabular-nums">0{index + 1}</span>
                       <span className="text-sm font-semibold">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{page.views.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Impressions</p>
                      </div>
                      <Badge variant="outline" className="bg-muted/50 border-border/80 font-bold tabular-nums">
                        {((page.views / (analytics?.pageViews || 1)) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                )) || (
                   <div className="p-8 text-center text-muted-foreground text-sm">Waiting for impression data...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
