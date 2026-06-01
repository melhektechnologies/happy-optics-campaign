"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Phone, 
  Mail,
  Calendar,
  Filter,
  MoreVertical,
  ArrowUpRight,
  Shield,
  Activity,
  History,
  FileText,
  LayoutGrid,
  List,
  Users,
  Sparkles,
  ChevronRight,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  created_at: string;
  last_visit: string | null;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-primary to-accent",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/dashboard/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isManager = userRole === "manager";

  return (
    <div className="space-y-7 page-container">

      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Patient Registry</span>
            </div>
            <h1 className="page-title">Patient Registry</h1>
            <p className="page-subtitle">Centralized medical records — {loading ? "—" : patients.length} patients enrolled.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <Filter className="h-3.5 w-3.5 mr-2" />
              Filter
            </Button>
            {isManager && (
              <Button asChild size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary">
                <Link href="/dashboard/patients/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enroll Patient
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Search + View Toggle ─── */}
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 bg-card border-border/60 focus:border-primary/40 text-sm font-medium rounded-xl shadow-xs"
          />
          {searchTerm && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full uppercase">
              {filteredPatients.length} found
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40">
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── Quick Stats Strip ─── */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Enrolled", value: patients.length, color: "text-primary" },
            { label: "With Last Visit", value: patients.filter(p => p.last_visit).length, color: "text-success" },
            { label: "Search Results", value: filteredPatients.length, color: "text-accent" },
          ].map((s, i) => (
            <div key={i} className="premium-card p-4 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Patient List/Grid ─── */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="premium-card p-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl shimmer-loader shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48 shimmer-loader" />
                    <Skeleton className="h-3 w-72 shimmer-loader opacity-60" />
                  </div>
                  <Skeleton className="h-9 w-24 shimmer-loader" />
                </div>
              </div>
            ))
          ) : filteredPatients.length === 0 ? (
            <div className="empty-state premium-card border-dashed py-20">
              <div className="p-5 bg-muted/40 rounded-full mb-4">
                <Users className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-base font-bold mb-1">No patients found</h3>
              <p className="text-xs text-muted-foreground max-w-[250px]">
                {searchTerm ? "Try adjusting your search query." : "Enroll your first patient to get started."}
              </p>
              {isManager && (
                <Button asChild size="sm" className="mt-4 bg-primary hover:bg-primary-hover">
                  <Link href="/dashboard/patients/new">
                    <UserPlus className="mr-2 h-3.5 w-3.5" /> Enroll Patient
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            filteredPatients.map((patient, idx) => (
              <div
                key={patient.id}
                className="premium-card group hover:border-primary/25 transition-all duration-300"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Identity */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-black shadow-md shrink-0 group-hover:scale-105 transition-transform",
                        getAvatarColor(patient.full_name)
                      )}>
                        {getInitials(patient.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold tracking-tight truncate">{patient.full_name}</h3>
                          {patient.last_visit && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-light/40 border border-success/15 shrink-0">
                              <History className="h-2.5 w-2.5 text-success" />
                              <span className="text-[9px] font-black text-success uppercase tracking-tighter">
                                Visited {new Date(patient.last_visit).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          PID: {patient.id.split('-')[0].toUpperCase()}
                        </p>

                        {/* Data row */}
                        <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-4 mt-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Phone className="h-3 w-3 text-primary/60 shrink-0" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground truncate">
                            <Mail className="h-3 w-3 text-primary/60 shrink-0" />
                            {patient.email || "—"}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Calendar className="h-3 w-3 text-primary/60 shrink-0" />
                            {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "—"}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Activity className="h-3 w-3 text-primary/60 shrink-0" />
                            {patient.gender || "Not set"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-none border-border/40 shrink-0">
                      <Button variant="outline" size="sm" className="h-8 border-border/70 hover:border-primary/30 hover:bg-primary-light/10 text-[10px] font-bold uppercase tracking-wider">
                        <FileText className="mr-1.5 h-3 w-3" />
                        Charts
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-border/70 hover:border-primary/30 hover:bg-primary-light/10 text-[10px] font-bold uppercase tracking-wider">
                        <Edit className="mr-1.5 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 border-border/70 hover:border-primary/30">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Grid mode */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="premium-card p-5 space-y-4">
                <Skeleton className="h-14 w-14 rounded-xl shimmer-loader mx-auto" />
                <Skeleton className="h-5 w-32 shimmer-loader mx-auto" />
                <Skeleton className="h-3 w-24 shimmer-loader mx-auto opacity-60" />
              </div>
            ))
          ) : filteredPatients.map((patient, idx) => (
            <div
              key={patient.id}
              className="premium-card p-5 group hover:border-primary/30 text-center transition-all"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={cn(
                "h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-base font-black shadow-md mx-auto mb-3 group-hover:scale-105 transition-transform",
                getAvatarColor(patient.full_name)
              )}>
                {getInitials(patient.full_name)}
              </div>
              <h3 className="text-sm font-bold truncate">{patient.full_name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{patient.phone}</p>
              {patient.gender && (
                <Badge variant="outline" className="mt-2 text-[9px] font-bold uppercase">{patient.gender}</Badge>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] font-bold hover:border-primary/30">
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 hover:border-primary/30">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
