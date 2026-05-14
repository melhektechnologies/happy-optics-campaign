"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Send,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  LoadingState,
  EmptyState,
  ErrorState,
  ForbiddenState,
} from "@/components/ui/state-panel";

interface Appointment {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  branch: string;
  preferred_date: string;
  preferred_time: string;
  reason: string | null;
  is_unity_student: boolean;
  notes: string | null;
  created_at: string;
  reminder_sent?: boolean;
}

const branchNames: Record<string, string> = {
  "head-office": "Head Office - Addis Ababa Stadium",
  "bole": "Bole Branch - Near Waga Eye Centre",
  "kera": "Kera Downtown - Near Neser Eye Clinic",
  "bethzatha": "Betezatha - Inside Betezatha General Hospital",
};

type FetchStatus = "idle" | "loading" | "ok" | "error" | "forbidden";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reminderPendingId, setReminderPendingId] = useState<string | null>(null);
  const { user } = useCurrentUser();
  const userRole = user?.role ?? "";
  const userBranch = user?.branch ?? "";
  const { confirm, ConfirmDialog } = useConfirm();

  const fetchAppointments = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/appointments", {
        credentials: "include",
      });
      if (response.status === 401 || response.status === 403) {
        setStatus("forbidden");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }
      const data = await response.json();
      setAppointments(data);
      setStatus("ok");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const sendReminder = async (appointment: Appointment) => {
    const ok = await confirm({
      title: "Send appointment reminder?",
      description: `An SMS will be sent to ${appointment.full_name} at ${appointment.phone}.`,
      confirmLabel: "Send reminder",
    });
    if (!ok) return;

    setReminderPendingId(appointment.id);
    try {
      const response = await fetch("/api/appointments/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appointmentId: appointment.id }),
      });

      const data = await response.json();

      if (data.success && data.smsStatus === "sent") {
        toast.success("Reminder sent", {
          description: `SMS delivered to ${appointment.full_name}.`,
        });
        fetchAppointments();
      } else if (data.smsStatus === "logged") {
        toast.warning("SMS provider not configured", {
          description:
            "Reminder was logged but no SMS was sent. Configure Twilio in production.",
        });
        fetchAppointments();
      } else if (data.smsStatus === "failed") {
        toast.error("Reminder failed", {
          description: data.message ?? "SMS provider returned an error.",
        });
      } else {
        toast(
          data.message ?? "Reminder processed. Check server logs for details."
        );
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Reminder could not be sent", {
        description: "Network error. Please try again.",
      });
    } finally {
      setReminderPendingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (userRole && userRole !== "manager" && apt.branch !== userBranch) {
      return false;
    }

    const matchesFilter =
      filter === "all" ||
      (filter === "today" && apt.preferred_date === new Date().toISOString().split("T")[0]) ||
      (filter === "upcoming" && apt.preferred_date >= new Date().toISOString().split("T")[0]) ||
      (filter === "unity" && apt.is_unity_student);

    const matchesSearch =
      apt.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm) ||
      (apt.email && apt.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage all appointment bookings</p>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/dashboard/appointments/new">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search by name, phone, or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter</label>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Appointments</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="unity">Unity Students</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.preferred_date === new Date().toISOString().split("T")[0]).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Today</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.is_unity_student).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Unity</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Filtered</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {status === "loading" ? (
          <LoadingState title="Loading appointments…" />
        ) : status === "forbidden" ? (
          <ForbiddenState description="You don't have permission to view appointments." />
        ) : status === "error" ? (
          <ErrorState
            description="We couldn't load appointments."
            action={{ label: "Retry", onClick: fetchAppointments }}
          />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            title="No appointments match your filters"
            description="Try clearing the search or switching to All Appointments."
          />
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <CardTitle className="text-lg sm:text-xl break-words">
                        {appointment.full_name}
                      </CardTitle>
                      {appointment.is_unity_student && (
                        <Badge className="bg-primary/20 text-primary">Unity Student</Badge>
                      )}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="h-4 w-4 shrink-0" />
                        <a href={`tel:${appointment.phone}`} className="truncate hover:text-primary">
                          {appointment.phone}
                        </a>
                      </div>
                      {appointment.email && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="h-4 w-4 shrink-0" />
                          <a
                            href={`mailto:${appointment.email}`}
                            className="truncate hover:text-primary"
                          >
                            {appointment.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{branchNames[appointment.branch]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {new Date(appointment.preferred_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        {appointment.preferred_time}
                      </div>
                      {appointment.reason && (
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="truncate">{appointment.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => sendReminder(appointment)}
                    variant="outline"
                    size="sm"
                    disabled={reminderPendingId === appointment.id}
                    className="self-start lg:ml-4 lg:self-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {reminderPendingId === appointment.id ? "Sending…" : "Send Reminder"}
                  </Button>
                </div>
              </CardHeader>
              {appointment.notes && (
                <CardContent>
                  <div className="text-sm break-words">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
      <ConfirmDialog />
    </div>
  );
}
