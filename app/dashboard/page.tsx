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
  Download,
  RefreshCw,
  Home,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

const COLORS = ['#0d7377', '#14b8a6', '#0a5d61', '#1a1a1a'];

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
    try {
      // Fetch from API endpoints
      const [patientsRes, appointmentsRes, salesRes, analyticsRes] = await Promise.all([
        fetch("/api/dashboard/patients/count"),
        fetch("/api/dashboard/appointments/today"),
        fetch("/api/dashboard/sales/monthly"),
        userRole === "manager" ? fetch("/api/analytics").catch(() => null) : Promise.resolve(null),
      ]);

      const patients = await patientsRes.json().catch(() => ({ count: 0 }));
      const appointments = await appointmentsRes.json().catch(() => ({ count: 0 }));
      const sales = await salesRes.json().catch(() => ({ total: 0 }));
      
      let analyticsData = null;
      if (analyticsRes && analyticsRes.ok) {
        try {
          analyticsData = await analyticsRes.json();
          // Ensure conversionRate is a number
          if (analyticsData && typeof analyticsData.conversionRate !== 'number') {
            analyticsData.conversionRate = parseFloat(analyticsData.conversionRate || '0') || 0;
          }
        } catch (e) {
          console.error("Error parsing analytics:", e);
          analyticsData = null;
        }
      }

      setStats({
        totalPatients: patients.count || 0,
        todayAppointments: appointments.count || 0,
        monthlySales: sales.total || 0,
        recentActivity: [],
      });
      
      if (analyticsData && userRole === "manager") {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isManager ? "Complete overview of your clinic operations" : "Your clinic operations"}
          </p>
        </div>
        <div className="flex gap-2">
          {isManager && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Website
                </Link>
              </Button>
              <Button onClick={fetchDashboardData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Manager Tabs */}
      {isManager && (
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "analytics"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPatients}</div>
                <p className="text-xs text-muted-foreground">All registered patients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlySales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month's revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Manager-only Analytics Cards */}
          {isManager && analytics && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalVisits.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total visits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Unique users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total page views</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof analytics.conversionRate === 'number' 
                      ? analytics.conversionRate.toFixed(1) 
                      : parseFloat(analytics.conversionRate || '0').toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Visit to appointment</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Analytics Tab (Manager Only) */}
      {activeTab === "analytics" && isManager && analytics && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.appointmentsByBranch && analytics.appointmentsByBranch.length > 0 && analytics.appointmentsByBranch.some((b: any) => b.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.appointmentsByBranch}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.appointmentsByBranch.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No appointment data yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointments Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.appointmentsByDate && analytics.appointmentsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.appointmentsByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#0d7377" strokeWidth={2} name="Appointments" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No appointment data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm font-medium">{page.page}</span>
                    <Badge variant="outline">{page.views.toLocaleString()} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isManager && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/patients/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/appointments/new">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/prescriptions/new">
                <FileText className="mr-2 h-4 w-4" />
                Create Prescription
              </Link>
            </Button>
            {isManager && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/sales/new">
                  <DollarSign className="mr-2 h-4 w-4" />
                  New Sale
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
