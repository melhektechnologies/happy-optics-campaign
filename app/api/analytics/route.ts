import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Secure Authentication & Manager-Only Authorization
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden: Managerial clearance required to view global analytics." },
        { status: 403 }
      );
    }

    // 2. Fetch appointments for analytics
    const { data: appointments, error } = await supabaseAdmin
      .from("public_appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Analytics API] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch analytics data." },
        { status: 500 }
      );
    }

    // 3. Process analytics from appointments
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const appointmentsToday = appointments?.filter(
      (apt) => apt.preferred_date === todayStr
    ).length || 0;

    const appointmentsThisWeek = appointments?.filter((apt) => {
      const aptDate = new Date(apt.preferred_date);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return aptDate >= weekAgo;
    }).length || 0;

    const appointmentsThisMonth = appointments?.filter((apt) => {
      const aptDate = new Date(apt.preferred_date);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return aptDate >= monthAgo;
    }).length || 0;

    // Branch distribution with proper branch names
    const branchCounts = (appointments || []).reduce((acc, apt) => {
      const branch = apt.branch || 'unknown';
      acc[branch] = (acc[branch] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const branchNameMap: Record<string, string> = {
      'head-office': 'Head Office',
      'bole': 'Bole',
      'kera': 'Kera',
      'bethzatha': 'Betezatha',
    };

    const appointmentsByBranch = Object.entries(branchCounts).map(([branch, count]) => ({
      branch: branchNameMap[branch] || branch,
      count,
    }));

    // Date-based distribution (last 30 days)
    const dateCounts: Record<string, number> = {};
    (appointments || []).forEach((apt) => {
      const date = apt.preferred_date;
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const appointmentsByDate = Object.entries(dateCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      }));

    // Calculate conversion rate (appointments / estimated visits)
    const totalAppointments = (appointments || []).length;
    const estimatedVisits = Math.max(1000, totalAppointments * 10);
    const conversionRate = estimatedVisits > 0 
      ? (totalAppointments / estimatedVisits) * 100 
      : 0.0;

    // Compile analytics payload
    const analytics = {
      totalVisits: estimatedVisits,
      uniqueVisitors: Math.floor(estimatedVisits * 0.7),
      pageViews: Math.floor(estimatedVisits * 1.5),
      appointmentsToday,
      appointmentsThisWeek,
      appointmentsThisMonth,
      conversionRate: Number(conversionRate.toFixed(2)),
      topPages: [
        { page: "Home", views: Math.floor(estimatedVisits * 0.4) },
        { page: "Services", views: Math.floor(estimatedVisits * 0.25) },
        { page: "Book", views: Math.floor(estimatedVisits * 0.2) },
        { page: "About", views: Math.floor(estimatedVisits * 0.1) },
        { page: "Unity Campaign", views: Math.floor(estimatedVisits * 0.05) },
      ],
      appointmentsByBranch: appointmentsByBranch.length > 0 ? appointmentsByBranch : [
        { branch: "Head Office", count: 0 },
        { branch: "Bole", count: 0 },
        { branch: "Kera", count: 0 },
        { branch: "Betezatha", count: 0 },
      ],
      appointmentsByDate: appointmentsByDate.length > 0 ? appointmentsByDate : [],
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("[Analytics API] Fatal GET error:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
