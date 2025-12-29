import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// This endpoint syncs patients from appointments
// When an appointment is made, automatically create a patient record if it doesn't exist
export async function POST() {
  try {
    // Get all appointments
    const { data: appointments, error: aptError } = await supabaseAdmin
      .from("public_appointments")
      .select("full_name, phone, email");

    if (aptError) {
      console.error("Error fetching appointments:", aptError);
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 }
      );
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: "No appointments to sync", synced: 0 });
    }

    // Get existing patients
    const { data: existingPatients, error: patientError } = await supabaseAdmin
      .from("patients")
      .select("phone, full_name");

    if (patientError) {
      console.error("Error fetching patients:", patientError);
      return NextResponse.json(
        { error: "Failed to fetch patients" },
        { status: 500 }
      );
    }

    const existingPhones = new Set(
      (existingPatients || []).map((p: any) => p.phone?.toLowerCase())
    );

    // Create patients from appointments that don't exist
    const newPatients = appointments
      .filter((apt: any) => apt.phone && !existingPhones.has(apt.phone.toLowerCase()))
      .map((apt: any) => ({
        full_name: apt.full_name,
        phone: apt.phone,
        email: apt.email || null,
      }));

    // Remove duplicates by phone
    const uniquePatients = Array.from(
      new Map(newPatients.map((p: any) => [p.phone.toLowerCase(), p])).values()
    );

    if (uniquePatients.length === 0) {
      return NextResponse.json({ message: "All patients already exist", synced: 0 });
    }

    // Insert new patients
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert(uniquePatients)
      .select();

    if (error) {
      console.error("Error creating patients:", error);
      return NextResponse.json(
        { error: "Failed to create patients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Synced ${uniquePatients.length} patients from appointments`,
      synced: uniquePatients.length,
      data,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

