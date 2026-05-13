"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  RefreshCw,
} from "lucide-react";

export default function BranchDashboardPage() {
  const params = useParams();
  const branch = params.branch as string;
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
  });
  // Loading flag is retained for future skeletons; currently the cards just
  // show the zero state while fetching.
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Cookie-based auth is automatic — no Authorization header.
      const [patientsRes, appointmentsRes] = await Promise.all([
        fetch("/api/dashboard/patients/count", { credentials: "include" }),
        fetch("/api/dashboard/appointments/today", { credentials: "include" }),
      ]);

      const patients = await patientsRes.json().catch(() => ({ count: 0 }));
      const appointments = await appointmentsRes.json().catch(() => ({ count: 0 }));

      setStats({
        totalPatients: patients.count || 0,
        todayAppointments: appointments.count || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Branch: <span className="font-medium capitalize">{branch}</span>
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
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
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">All patients</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

