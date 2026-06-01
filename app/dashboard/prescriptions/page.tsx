"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Download,
  Layers,
  ShieldCheck,
  MoreVertical,
  Printer,
  ClipboardList,
  Eye,
  ChevronRight,
  ScanEye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

function SpecItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/30 group-hover:bg-card transition-colors">
      <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-black text-foreground tabular-nums">{value || "0.00"}</div>
    </div>
  );
}

function getPatientInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch("/api/dashboard/prescriptions");
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

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-7 page-container">

      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <ScanEye className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Optical Diagnostics</span>
            </div>
            <h1 className="page-title">Refraction Registry</h1>
            <p className="page-subtitle">
              Validated optical prescriptions and lens specifications — {loading ? "—" : prescriptions.length} records.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <ClipboardList className="h-3.5 w-3.5 mr-2" />
              Export Log
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary">
              <Link href="/dashboard/prescriptions/new">
                <FileText className="mr-2 h-4 w-4" />
                New Prescription
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Stats ─── */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Records", value: prescriptions.length, color: "text-primary" },
            { label: "This Month", value: prescriptions.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, color: "text-accent" },
            { label: "Search Results", value: filteredPrescriptions.length, color: "text-success" },
          ].map((s, i) => (
            <div key={i} className="premium-card p-4 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Search ─── */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search prescriptions by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 h-11 bg-card border-border/60 focus:border-primary/40 rounded-xl text-sm shadow-xs"
        />
      </div>

      {/* ─── Prescription Cards ─── */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="premium-card p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 shimmer-loader" />
                  <Skeleton className="h-3 w-28 shimmer-loader opacity-60" />
                </div>
                <Skeleton className="h-6 w-16 shimmer-loader" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[0, 1].map(j => (
                  <div key={j} className="space-y-3">
                    <Skeleton className="h-4 w-28 shimmer-loader opacity-80" />
                    <div className="grid grid-cols-3 gap-3">
                      <Skeleton className="h-12 w-full shimmer-loader opacity-40 rounded-xl" />
                      <Skeleton className="h-12 w-full shimmer-loader opacity-40 rounded-xl" />
                      <Skeleton className="h-12 w-full shimmer-loader opacity-40 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : filteredPrescriptions.length === 0 ? (
          <div className="empty-state premium-card border-dashed py-20">
            <div className="p-5 bg-muted/40 rounded-full mb-4">
              <Layers className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-base font-bold mb-1">No prescriptions found</h3>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {searchTerm ? "Try a different patient name." : "No records yet. Create the first prescription."}
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription, idx) => (
            <div
              key={prescription.id}
              className="premium-card group hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute right-0 top-0 h-28 w-28 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none rounded-tr-xl" />
              
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left sidebar: date + status */}
                  <div className="md:w-44 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-border/40 bg-muted/[0.04]">
                    {/* Patient avatar */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-black shadow-md shrink-0">
                        {getPatientInitials(prescription.patient_name)}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-primary/70 uppercase tracking-widest">Patient</p>
                        <p className="text-xs font-bold truncate max-w-[80px]">{prescription.patient_name.split(' ')[0]}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Auth Date</p>
                      <p className="text-sm font-black text-foreground">
                        {new Date(prescription.prescription_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success-light/30 border border-success/15 w-fit">
                      <ShieldCheck className="h-3 w-3 text-success" />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-success">Validated</span>
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1 p-6">
                    {/* Header row */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Patient Identity</p>
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                          {prescription.patient_name}
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:translate-x-0.5 transition-transform" />
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-border group-hover:border-primary/20 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Printer className="h-3 w-3 mr-1.5" /> Print
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-border group-hover:border-primary/20 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Download className="h-3 w-3 mr-1.5" /> Export
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-border group-hover:border-primary/20"
                          onClick={() => setExpanded(expanded === prescription.id ? null : prescription.id)}
                        >
                          {expanded === prescription.id
                            ? <MoreVertical className="h-4 w-4" />
                            : <Eye className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>

                    {/* Lens specs */}
                    <div className="grid md:grid-cols-2 gap-6 relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/40 hidden md:block" />

                      {/* OD — Right Eye */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-sm" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Oculus Dexter (OD) — Right</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <SpecItem label="SPH" value={prescription.right_eye_sphere} />
                          <SpecItem label="CYL" value={prescription.right_eye_cylinder} />
                          <SpecItem label="AXIS" value={prescription.right_eye_axis} />
                        </div>
                      </div>

                      {/* OS — Left Eye */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-accent to-teal-400 shadow-sm" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Oculus Sinister (OS) — Left</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <SpecItem label="SPH" value={prescription.left_eye_sphere} />
                          <SpecItem label="CYL" value={prescription.left_eye_cylinder} />
                          <SpecItem label="AXIS" value={prescription.left_eye_axis} />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {prescription.notes && (
                      <div className="mt-5 pt-4 border-t border-border/40">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                          <p className="text-[9px] font-black uppercase tracking-widest text-foreground mb-1.5">Clinical Notes</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{prescription.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
