"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  CheckCircle2, 
  XCircle,
  Send,
  RefreshCw,
  Filter
} from "lucide-react";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [userBranch, setUserBranch] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    const branch = localStorage.getItem("user_branch") || "";
    setUserRole(role);
    setUserBranch(branch);
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    toast(`Send SMS to ${appointment.full_name}?`, {
      description: `Phone: ${appointment.phone}`,
      action: {
        label: "Send",
        onClick: async () => {
          try {
            const response = await fetch("/api/appointments/reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appointmentId: appointment.id,
                phone: appointment.phone,
                name: appointment.full_name,
                date: appointment.preferred_date,
                time: appointment.preferred_time,
                branch: branchNames[appointment.branch],
              }),
            });

            const data = await response.json();

            if (data.success && data.smsStatus === "sent") {
              toast.success(`SMS Reminder sent to ${appointment.full_name}`);
              fetchAppointments();
            } else if (data.smsStatus === "logged") {
              toast.warning("Reminder logged. Twilio not configured.");
              fetchAppointments();
            } else if (data.smsStatus === "failed") {
              toast.error(`Failed to send SMS: ${data.message}`);
            } else {
              toast.info(data.message || "Reminder processed.");
              fetchAppointments();
            }
          } catch (error) {
            console.error("Error sending reminder:", error);
            toast.error("Error sending reminder. Check console.");
          }
        },
      },
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    // Non-manager users can only see appointments for their branch
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-muted/60" />
            <Skeleton className="h-4 w-72 bg-muted/40" />
          </div>
          <Skeleton className="h-10 w-44 bg-muted/60" />
        </div>

        {/* Filter Card Skeleton */}
        <Card className="border-border/60 bg-card/40 backdrop-blur-xs">
          <CardContent className="p-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-muted/50" />
              <Skeleton className="h-10 w-full bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-muted/50" />
              <Skeleton className="h-10 w-full bg-muted/40" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Row Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/60 bg-card/40">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-7 w-12 bg-muted/65" />
                <Skeleton className="h-4 w-24 bg-muted/40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointment Cards Skeletons */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border/60 bg-card/40">
              <CardHeader className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-36 bg-muted/60" />
                      <Skeleton className="h-5 w-24 bg-muted/45" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <Skeleton className="h-4 w-28 bg-muted/40" />
                      <Skeleton className="h-4 w-36 bg-muted/40" />
                      <Skeleton className="h-4 w-24 bg-muted/40" />
                      <Skeleton className="h-4 w-40 bg-muted/40" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-32 bg-muted/50" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">View and manage all appointment bookings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

          {/* Filters */}
          <Card className="mb-6 border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search by name, phone, or email..."
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

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{appointments.length}</div>
                <div className="text-sm text-muted-foreground">Total Appointments</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {appointments.filter((a) => a.preferred_date === new Date().toISOString().split("T")[0]).length}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {appointments.filter((a) => a.is_unity_student).length}
                </div>
                <div className="text-sm text-muted-foreground">Unity Students</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Filtered Results</div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No appointments found</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{appointment.full_name}</CardTitle>
                          {appointment.is_unity_student && (
                            <Badge className="bg-primary/20 text-primary">Unity Student</Badge>
                          )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${appointment.phone}`} className="hover:text-primary">
                              {appointment.phone}
                            </a>
                          </div>
                          {appointment.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${appointment.email}`} className="hover:text-primary">
                                {appointment.email}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {branchNames[appointment.branch]}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(appointment.preferred_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {appointment.preferred_time}
                          </div>
                          {appointment.reason && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {appointment.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => sendReminder(appointment)}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                    </div>
                  </CardHeader>
                  {appointment.notes && (
                    <CardContent>
                      <div className="text-sm">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
    </div>
  );
}

