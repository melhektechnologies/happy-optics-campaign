"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  full_name: string;
}

const branches = [
  { value: "head-office", label: "Head Office - Addis Ababa Stadium" },
  { value: "bole", label: "Bole Branch - Near Waga Eye Centre" },
  { value: "kera", label: "Kera Downtown - Near Neser Eye Clinic" },
  { value: "bethzatha", label: "Betezatha - Inside Betezatha General Hospital" },
];

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "mobile", label: "Mobile Payment" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    sale_date: new Date().toISOString().split("T")[0],
    total_amount: "",
    items: "",
    payment_method: "",
    branch: "",
  });

  useEffect(() => {
    fetch("/api/dashboard/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/dashboard/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_amount: parseFloat(formData.total_amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if we're in manager context
        const currentPath = window.location.pathname;
        if (currentPath.includes("/manager/")) {
          router.push("/dashboard/manager/sales");
        } else {
          router.push("/dashboard/sales");
        }
      } else {
        setError(data.error || "Failed to create sale");
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
            router.push("/dashboard/manager/sales");
          } else {
            router.push("/dashboard/sales");
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Sale</h1>
          <p className="text-muted-foreground">Record a new sale transaction</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Information</CardTitle>
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
                <Label htmlFor="sale_date">Sale Date *</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount (ETB) *</Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  required
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </Select>
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
            </div>
            <div>
              <Label htmlFor="items">Items/Services *</Label>
              <Textarea
                id="items"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                rows={3}
                placeholder="e.g., Eyeglasses frame + lenses, Eye exam, Contact lenses..."
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <DollarSign className="mr-2 h-4 w-4" />
                {loading ? "Recording..." : "Record Sale"}
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

