import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";

// NOTE: traffic / visit numbers below are derived heuristically from the
// appointment volume in our DB; we do not yet have a real analytics
// provider wired up. The booking metrics are real. Treat this endpoint as
// a manager-only dashboard data source, not a public traffic feed.

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, "manager");
  if (!auth.ok) return auth.response;

  try {
    const { data: appointments, error } = await supabaseAdmin
      .from("public_appointments")
      .select("preferred_date, branch")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[analytics] fetch error:", error);
      return internalError("Failed to fetch analytics data.");
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    type AppointmentRow = { preferred_date: string; branch: string | null };
    const rows = (appointments ?? []) as AppointmentRow[];

    const appointmentsToday = rows.filter(
      (apt) => apt.preferred_date === todayStr
    ).length;

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const appointmentsThisWeek = rows.filter(
      (apt) => new Date(apt.preferred_date) >= weekAgo
    ).length;

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const appointmentsThisMonth = rows.filter(
      (apt) => new Date(apt.preferred_date) >= monthAgo
    ).length;

    const branchCounts: Record<string, number> = {};
    for (const apt of rows) {
      const b = apt.branch || "unknown";
      branchCounts[b] = (branchCounts[b] || 0) + 1;
    }

    const branchNameMap: Record<string, string> = {
      "head-office": "Head Office",
      bole: "Bole",
      kera: "Kera",
      bethzatha: "Betezatha",
    };
    const appointmentsByBranch = Object.entries(branchCounts).map(
      ([branch, count]) => ({
        branch: branchNameMap[branch] || branch,
        count,
      })
    );

    const dateCounts: Record<string, number> = {};
    for (const apt of rows) {
      dateCounts[apt.preferred_date] = (dateCounts[apt.preferred_date] || 0) + 1;
    }
    const appointmentsByDate = Object.entries(dateCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      }));

    const totalAppointments = rows.length;
    // Heuristic traffic estimate — clearly marked as such on the wire.
    const estimatedVisits = Math.max(1000, totalAppointments * 10);
    const conversionRate =
      estimatedVisits > 0 ? (totalAppointments / estimatedVisits) * 100 : 0;

    // The traffic fields below (totalVisits/uniqueVisitors/pageViews/
    // conversionRate/topPages) are heuristic estimates derived from
    // appointment volume — we don't yet have a real web-analytics
    // provider wired up. The appointment metrics are real.
    return NextResponse.json({
      appointmentsToday,
      appointmentsThisWeek,
      appointmentsThisMonth,
      appointmentsByBranch:
        appointmentsByBranch.length > 0
          ? appointmentsByBranch
          : [
              { branch: "Head Office", count: 0 },
              { branch: "Bole", count: 0 },
              { branch: "Kera", count: 0 },
              { branch: "Betezatha", count: 0 },
            ],
      appointmentsByDate,
      totalVisits: estimatedVisits,
      uniqueVisitors: Math.floor(estimatedVisits * 0.7),
      pageViews: Math.floor(estimatedVisits * 1.5),
      conversionRate: Number(conversionRate.toFixed(2)),
      topPages: [
        { page: "Home", views: Math.floor(estimatedVisits * 0.4) },
        { page: "Services", views: Math.floor(estimatedVisits * 0.25) },
        { page: "Book", views: Math.floor(estimatedVisits * 0.2) },
        { page: "About", views: Math.floor(estimatedVisits * 0.1) },
        { page: "Unity Campaign", views: Math.floor(estimatedVisits * 0.05) },
      ],
      isEstimated: true,
    });
  } catch (err) {
    console.error("[analytics] unexpected error:", err);
    return internalError();
  }
}
