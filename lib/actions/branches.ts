"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getBranchIntelligence() {
  try {
    // 1. Fetch sales aggregated by branch
    const { data: salesData, error: salesError } = await supabaseAdmin
      .from("sales")
      .select("branch, total_amount, created_at");

    if (salesError) throw salesError;

    // 2. Fetch appointments aggregated by branch
    const { data: appointmentData, error: apptError } = await supabaseAdmin
      .from("appointments")
      .select("branch, status");

    if (apptError) throw apptError;

    // 3. Process Intelligence
    const branches = ["Stadium", "Unity", "Bole", "Haya Hulet"];
    
    const intelligence = branches.map(name => {
      const branchSales = salesData?.filter(s => s.branch === name) || [];
      const branchAppts = appointmentData?.filter(a => a.branch === name) || [];
      
      const revenue = branchSales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);
      const patientVolume = branchAppts.length;
      const pendingAppts = branchAppts.filter(a => a.status === 'pending').length;

      return {
        name,
        revenue,
        patientVolume,
        pendingAppts,
        efficiency: patientVolume > 0 ? ((patientVolume - pendingAppts) / patientVolume * 100).toFixed(1) : 0
      };
    });

    return { success: true, data: intelligence };
  } catch (error) {
    console.error("[Branch Intelligence] Error:", error);
    return { success: false, error: "Failed to aggregate branch intelligence." };
  }
}
