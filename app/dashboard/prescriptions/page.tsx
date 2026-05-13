"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Eye, 
  Download,
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

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useCurrentUser();
  const userRole = user?.role ?? "";

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch("/api/dashboard/prescriptions", {
        credentials: "include",
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
          <p className="text-muted-foreground">
            {userRole === "manager" ? "Manage patient prescriptions" : "View patient prescriptions"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/prescriptions/new">
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
                    <CardTitle className="text-lg">{prescription.patient_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(prescription.prescription_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Right Eye</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Sphere: {prescription.right_eye_sphere || "N/A"}</p>
                      <p>Cylinder: {prescription.right_eye_cylinder || "N/A"}</p>
                      <p>Axis: {prescription.right_eye_axis || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Left Eye</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Sphere: {prescription.left_eye_sphere || "N/A"}</p>
                      <p>Cylinder: {prescription.left_eye_cylinder || "N/A"}</p>
                      <p>Axis: {prescription.left_eye_axis || "N/A"}</p>
                    </div>
                  </div>
                </div>
                {prescription.notes && (
                  <p className="text-sm text-muted-foreground mb-4">{prescription.notes}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

