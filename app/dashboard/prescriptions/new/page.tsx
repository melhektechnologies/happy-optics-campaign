"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  full_name: string;
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    prescription_date: new Date().toISOString().split("T")[0],
    right_eye_sphere: "",
    right_eye_cylinder: "",
    right_eye_axis: "",
    left_eye_sphere: "",
    left_eye_cylinder: "",
    left_eye_axis: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/dashboard/patients", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setPatients([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/dashboard/prescriptions", {
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
          router.push("/dashboard/manager/prescriptions");
        } else {
          router.push("/dashboard/prescriptions");
        }
      } else {
        setError(data.error || "Failed to create prescription");
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
            router.push("/dashboard/manager/prescriptions");
          } else {
            router.push("/dashboard/prescriptions");
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Prescription</h1>
          <p className="text-muted-foreground">Create a new eye prescription</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="patient_id">Patient *</Label>
                <Select
                  id="patient_id"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  required
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="prescription_date">Prescription Date *</Label>
                <Input
                  id="prescription_date"
                  type="date"
                  value={formData.prescription_date}
                  onChange={(e) => setFormData({ ...formData, prescription_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Right Eye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="right_eye_sphere">Sphere</Label>
                    <Input
                      id="right_eye_sphere"
                      type="number"
                      step="0.25"
                      value={formData.right_eye_sphere}
                      onChange={(e) => setFormData({ ...formData, right_eye_sphere: e.target.value })}
                      placeholder="e.g., -2.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="right_eye_cylinder">Cylinder</Label>
                    <Input
                      id="right_eye_cylinder"
                      type="number"
                      step="0.25"
                      value={formData.right_eye_cylinder}
                      onChange={(e) => setFormData({ ...formData, right_eye_cylinder: e.target.value })}
                      placeholder="e.g., -0.75"
                    />
                  </div>
                  <div>
                    <Label htmlFor="right_eye_axis">Axis</Label>
                    <Input
                      id="right_eye_axis"
                      type="number"
                      min="0"
                      max="180"
                      value={formData.right_eye_axis}
                      onChange={(e) => setFormData({ ...formData, right_eye_axis: e.target.value })}
                      placeholder="e.g., 90"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Left Eye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="left_eye_sphere">Sphere</Label>
                    <Input
                      id="left_eye_sphere"
                      type="number"
                      step="0.25"
                      value={formData.left_eye_sphere}
                      onChange={(e) => setFormData({ ...formData, left_eye_sphere: e.target.value })}
                      placeholder="e.g., -2.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="left_eye_cylinder">Cylinder</Label>
                    <Input
                      id="left_eye_cylinder"
                      type="number"
                      step="0.25"
                      value={formData.left_eye_cylinder}
                      onChange={(e) => setFormData({ ...formData, left_eye_cylinder: e.target.value })}
                      placeholder="e.g., -0.75"
                    />
                  </div>
                  <div>
                    <Label htmlFor="left_eye_axis">Axis</Label>
                    <Input
                      id="left_eye_axis"
                      type="number"
                      min="0"
                      max="180"
                      value={formData.left_eye_axis}
                      onChange={(e) => setFormData({ ...formData, left_eye_axis: e.target.value })}
                      placeholder="e.g., 90"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes or recommendations..."
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <FileText className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Create Prescription"}
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

