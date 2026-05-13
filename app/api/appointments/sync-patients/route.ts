import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";
import { internalError } from "@/lib/api/errors";

// Bulk backfill: copies any appointment whose phone number isn't yet in
// `patients` into the patients table. Manager-only — previously this was
// public and would let anyone read every appointment's PII.
export async function POST(request: NextRequest) {
  const auth = await requireRole(request, "manager");
  if (!auth.ok) return auth.response;

  try {
    const { data: appointments, error: aptError } = await supabaseAdmin
      .from("public_appointments")
      .select("full_name, phone, email");

    if (aptError) {
      console.error("[sync-patients] fetch appointments:", aptError);
      return internalError("Failed to fetch appointments");
    }
    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ synced: 0, message: "No appointments to sync" });
    }

    const { data: existingPatients, error: patientError } = await supabaseAdmin
      .from("patients")
      .select("phone");

    if (patientError) {
      console.error("[sync-patients] fetch patients:", patientError);
      return internalError("Failed to fetch patients");
    }

    type PatientRow = { phone: string | null };
    type AppointmentRow = {
      phone: string | null;
      full_name: string | null;
      email: string | null;
    };
    type NewPatient = {
      full_name: string | null;
      phone: string;
      email: string | null;
    };

    const existingPhones = new Set(
      ((existingPatients ?? []) as PatientRow[])
        .map((p) => p.phone?.toLowerCase())
        .filter((p): p is string => Boolean(p))
    );

    const newPatients: NewPatient[] = (appointments as AppointmentRow[])
      .filter(
        (apt): apt is AppointmentRow & { phone: string } =>
          Boolean(apt.phone) && !existingPhones.has(apt.phone!.toLowerCase())
      )
      .map((apt) => ({
        full_name: apt.full_name,
        phone: apt.phone,
        email: apt.email || null,
      }));

    const uniquePatients: NewPatient[] = Array.from(
      new Map(newPatients.map((p) => [p.phone.toLowerCase(), p])).values()
    );

    if (uniquePatients.length === 0) {
      return NextResponse.json({ synced: 0, message: "All patients already exist" });
    }

    const { error } = await supabaseAdmin
      .from("patients")
      .insert(uniquePatients)
      .select("id");
    if (error) {
      console.error("[sync-patients] insert error:", error);
      return internalError("Failed to create patients");
    }

    return NextResponse.json({ synced: uniquePatients.length });
  } catch (err) {
    console.error("[sync-patients] unexpected error:", err);
    return internalError();
  }
}
