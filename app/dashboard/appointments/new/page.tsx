"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

const branches = [
  { value: "head-office", label: "Head Office - Addis Ababa Stadium" },
  { value: "bole", label: "Bole Branch - Near Waga Eye Centre" },
  { value: "kera", label: "Kera Downtown - Near Neser Eye Clinic" },
  { value: "bethzatha", label: "Betezatha - Inside Betezatha General Hospital" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    branch: "",
    preferred_date: "",
    preferred_time: "",
    reason: "",
    notes: "",
    is_unity_student: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if we're in manager context
        const currentPath = window.location.pathname;
        if (currentPath.includes("/manager/")) {
          router.push("/dashboard/manager/appointments");
        } else {
          router.push("/dashboard/appointments");
        }
      } else {
        setError(data.error || "Failed to create appointment");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => {
          const currentPath = window.location.pathname;
          if (currentPath.includes("/manager/")) {
            router.push("/dashboard/manager/appointments");
          } else {
            router.push("/dashboard/appointments");
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Appointment</h1>
          <p className="text-muted-foreground">Create a new appointment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="branch">Branch *</Label>
                <Select
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  required
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="preferred_date">Preferred Date *</Label>
                <Input
                  id="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferred_time">Preferred Time *</Label>
                <Select
                  id="preferred_time"
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_unity_student"
                  checked={formData.is_unity_student}
                  onChange={(e) => setFormData({ ...formData, is_unity_student: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_unity_student">Unity University Student</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Calendar className="mr-2 h-4 w-4" />
                {loading ? "Scheduling..." : "Schedule Appointment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

