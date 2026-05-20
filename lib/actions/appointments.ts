"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendAppointmentConfirmation } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

const appointmentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  branch: z.string().min(1, "Branch is required"),
  service: z.string().min(1, "Service type is required"),
  notes: z.string().optional(),
});

export async function createAppointment(formData: z.infer<typeof appointmentSchema>) {
  try {
    // 1. Validate Input
    const validated = appointmentSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const data = validated.data;

    // 2. Database Sync (Supabase)
    const { data: appointment, error: dbError } = await supabaseAdmin
      .from("appointments")
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          appointment_date: data.date,
          appointment_time: data.time,
          branch: data.branch,
          service_type: data.service,
          notes: data.notes,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("[Appointments] DB Error:", dbError);
      return { success: false, error: "Database synchronization failed. Please try again." };
    }

    // 3. Trigger Smart Notifications (Async)
    // We don't await this to keep the UI responsive, or await it if we want to guarantee delivery info
    sendAppointmentConfirmation({
      email: data.email || undefined,
      phone: data.phone,
      patientName: data.fullName,
      date: data.date,
      time: data.time,
      branch: data.branch,
    }).catch(err => console.error("[Notifications] Async trigger failed:", err));

    // 4. Revalidate cache
    revalidatePath("/dashboard/appointments");
    revalidatePath("/dashboard/manager/appointments");

    return { success: true, data: appointment };
  } catch (error) {
    console.error("[Appointments] Fatal Error:", error);
    return { success: false, error: "A system error occurred while processing your appointment." };
  }
}
