import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

// This endpoint syncs patients from appointments
// When an appointment is made, automatically create a patient record if it doesn't exist
export async function POST() {
  try {
    // 1. Secure Authentication & Manager-Only Authorization
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden: Only clinic managers can trigger patient synchronizations." },
        { status: 403 }
      );
    }

    // 2. Fetch all public appointments
    const { data: appointments, error: aptError } = await supabaseAdmin
      .from("public_appointments")
      .select("full_name, phone, email");

    if (aptError) {
      console.error("[Sync Patients API] Error fetching appointments:", aptError);
      return NextResponse.json(
        { error: "Failed to fetch appointments records" },
        { status: 500 }
      );
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: "No appointments to sync", synced: 0 });
    }

    // 3. Fetch existing patients
    const { data: existingPatients, error: patientError } = await supabaseAdmin
      .from("patients")
      .select("phone, full_name");

    if (patientError) {
      console.error("[Sync Patients API] Error fetching patients:", patientError);
      return NextResponse.json(
        { error: "Failed to fetch patients records" },
        { status: 500 }
      );
    }

    const existingPhones = new Set(
      (existingPatients || []).map((p: any) => p.phone?.toLowerCase().trim())
    );

    // 4. Filter appointments to identify unsynced patients
    const newPatients = appointments
      .filter((apt: any) => apt.phone && !existingPhones.has(apt.phone.toLowerCase().trim()))
      .map((apt: any) => ({
        full_name: apt.full_name.trim(),
        phone: apt.phone.trim(),
        email: apt.email?.toLowerCase().trim() || null,
        last_visit: new Date().toISOString().split("T")[0],
      }));

    // 5. Remove duplicates within the pending batch
    const uniquePatients = Array.from(
      new Map(newPatients.map((p: any) => [p.phone.toLowerCase(), p])).values()
    );

    if (uniquePatients.length === 0) {
      return NextResponse.json({ message: "All patients already synchronized", synced: 0 });
    }

    // 6. DB Bulk insertion
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert(uniquePatients)
      .select();

    if (error) {
      console.error("[Sync Patients API] Error inserting patients:", error);
      return NextResponse.json(
        { error: "Database synchronization failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully synchronized ${uniquePatients.length} patient records from appointments.`,
      synced: uniquePatients.length,
      data,
    });
  } catch (error) {
    console.error("[Sync Patients API] Fatal error during synchronization:", error);
    return NextResponse.json(
      { error: "An unexpected system error occurred." },
      { status: 500 }
    );
  }
}
