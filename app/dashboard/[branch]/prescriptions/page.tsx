"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Eye, 
  User,
  Calendar
} from "lucide-react";

interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  prescription_date: string;
  right_eye_sphere: string | null;
  right_eye_cylinder: string | null;
  right_eye_axis: string | null;
  left_eye_sphere: string | null;
  left_eye_cylinder: string | null;
  left_eye_axis: string | null;
  notes: string | null;
  created_at: string;
}

export default function BranchPrescriptionsPage() {
  const params = useParams();
  const branch = params.branch as string;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, [branch]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/dashboard/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">View patient prescriptions</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/${branch}/prescriptions/new`}>
            <FileText className="mr-2 h-4 w-4" />
            Create Prescription
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {prescription.patient_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(prescription.prescription_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Right Eye
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>Sphere: {prescription.right_eye_sphere || "N/A"}</div>
                      <div>Cylinder: {prescription.right_eye_cylinder || "N/A"}</div>
                      <div>Axis: {prescription.right_eye_axis || "N/A"}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Left Eye
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>Sphere: {prescription.left_eye_sphere || "N/A"}</div>
                      <div>Cylinder: {prescription.left_eye_cylinder || "N/A"}</div>
                      <div>Axis: {prescription.left_eye_axis || "N/A"}</div>
                    </div>
                  </div>
                </div>
                {prescription.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm">
                      <strong>Notes:</strong> {prescription.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

