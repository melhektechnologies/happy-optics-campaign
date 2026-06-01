"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Download,
  X,
  Shield,
  Briefcase,
  Activity,
  UserCheck,
  MoreVertical,
  Key,
  Users,
  Building2,
  Crown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  branch: string;
  role: string;
  position: string;
  status: "active" | "inactive";
  hire_date: string;
  created_at: string;
}

const branches = [
  { value: "head-office", label: "Addis Ababa Stadium" },
  { value: "bole", label: "Bole Clinical Hub" },
  { value: "kera", label: "Kera Downtown" },
  { value: "bethzatha", label: "Betezatha Center" },
];

const roles = [
  { value: "manager", label: "Global Director" },
  { value: "optometrist", label: "Lead Optometrist" },
  { value: "receptionist", label: "Client Relations" },
  { value: "technician", label: "Lab Technician" },
  { value: "sales", label: "Sales Specialist" },
];

const roleColors: Record<string, string> = {
  manager: "bg-violet-100 text-violet-700 border-violet-200",
  optometrist: "bg-primary-light/60 text-primary border-primary/20",
  receptionist: "bg-blue-100 text-blue-700 border-blue-200",
  technician: "bg-amber-100 text-amber-700 border-amber-200",
  sales: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const roleIcons: Record<string, any> = {
  manager: Crown,
  optometrist: Activity,
  receptionist: UserCheck,
  technician: Briefcase,
  sales: Building2,
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

const AVATAR_GRADIENTS = [
  "from-primary to-accent",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
];

function getGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    if (role && role !== "manager") {
      router.push(`/dashboard`);
      return;
    }
    fetchStaff();
  }, [router]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/dashboard/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesBranch = branchFilter === "all" || member.branch === branchFilter;
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesBranch && matchesRole;
  });

  const activeCount = staff.filter(s => s.status === "active").length;

  return (
    <div className="space-y-7 page-container">

      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Human Capital</span>
            </div>
            <h1 className="page-title">Team Management</h1>
            <p className="page-subtitle">
              {loading ? "—" : `${activeCount} active staff across ${branches.length} clinic branches.`}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="bg-primary hover:bg-primary-hover shadow-md glow-primary"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Stats Strip ─── */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Staff", value: staff.length, color: "text-primary" },
            { label: "Active", value: activeCount, color: "text-success" },
            { label: "Branches", value: branches.length, color: "text-accent" },
            { label: "Filtered", value: filteredStaff.length, color: "text-muted-foreground" },
          ].map((s, i) => (
            <div key={i} className="premium-card p-4 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Search & Filters ─── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 bg-card border-border/60 focus:border-primary/40 rounded-xl text-sm shadow-xs"
          />
        </div>
        <Select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="h-11 border-border/60 bg-card rounded-xl text-sm min-w-[180px]"
        >
          <option value="all">All Branches</option>
          {branches.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </Select>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-11 border-border/60 bg-card rounded-xl text-sm min-w-[160px]"
        >
          <option value="all">All Roles</option>
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </div>

      {/* ─── Staff Grid ─── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="premium-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl shimmer-loader shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 shimmer-loader" />
                  <Skeleton className="h-3 w-20 shimmer-loader opacity-60" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full shimmer-loader opacity-40" />
                <Skeleton className="h-3 w-4/5 shimmer-loader opacity-40" />
                <Skeleton className="h-3 w-3/5 shimmer-loader opacity-40" />
              </div>
            </div>
          ))
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-full empty-state premium-card border-dashed py-20">
            <div className="p-5 bg-muted/40 rounded-full mb-4">
              <Users className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-base font-bold mb-1">No staff members found</h3>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {searchTerm ? "Try adjusting your search." : "Add your first team member."}
            </p>
          </div>
        ) : (
          filteredStaff.map((member, idx) => {
            const RoleIcon = roleIcons[member.role] || Briefcase;
            return (
              <div
                key={member.id}
                className="premium-card group hover:border-primary/25 transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none rounded-tr-xl" />
                
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-black shadow-md shrink-0 group-hover:scale-105 transition-transform",
                      getGradient(member.full_name)
                    )}>
                      {getInitials(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold tracking-tight truncate">{member.full_name}</h3>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{member.position}</p>
                        </div>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 shrink-0",
                          member.status === "active"
                            ? "bg-success-light/50 text-success border-success/15"
                            : "bg-muted text-muted-foreground border-border"
                        )}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-3 text-[9px] font-bold uppercase border w-fit",
                      roleColors[member.role] || "text-muted-foreground border-border/60"
                    )}
                  >
                    <RoleIcon className="h-2.5 w-2.5 mr-1" />
                    {roles.find(r => r.value === member.role)?.label || member.role}
                  </Badge>
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                      <span className="truncate">{branches.find(b => b.value === member.branch)?.label || member.branch}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                      {member.phone}
                    </div>
                  </div>

                  {member.hire_date && (
                    <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">
                      Hired: {new Date(member.hire_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 border-border/60 group-hover:border-primary/20 text-[10px] font-bold uppercase tracking-wider hover:bg-primary-light/10"
                    >
                      <Edit className="mr-1.5 h-3 w-3" />
                      Edit Access
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-border/60 hover:border-primary/30"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Add Staff Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5 animate-in-fast">
          <div className="w-full max-w-lg bg-card border border-border/50 rounded-[28px] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 pb-6 border-b border-border/40 bg-muted/[0.04] relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-primary/8 to-transparent pointer-events-none rounded-tr-[28px]" />
              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Personnel Provisioning</p>
                <h2 className="text-2xl font-black tracking-tight">Enroll Team Member</h2>
                <p className="text-xs text-muted-foreground">Create system credentials for a new staff member.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-7 top-7 p-2 rounded-xl hover:bg-muted transition-colors relative z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <AddStaffForm
                onSuccess={() => { setShowAddModal(false); fetchStaff(); }}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddStaffForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    branch: "",
    role: "",
    position: "",
    password: "",
    hire_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/dashboard/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || "Failed to provision staff credentials.");
      }
    } catch {
      setError("Connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <FormInput label="Full Name" id="full_name" value={formData.full_name} onChange={(v) => setFormData({ ...formData, full_name: v })} placeholder="Dr. Firstname Lastname" icon={UserPlus} />
        <FormInput label="Email" id="email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="staff@happyoptics.com" icon={Mail} />
        <FormInput label="Phone" id="phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+251 9..." icon={Phone} />
        <FormInput label="Password" id="password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} placeholder="••••••••" icon={Key} />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Branch</Label>
        <Select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="h-11 bg-muted/40 border-border/80 rounded-xl text-sm">
          <option value="">Select branch...</option>
          {[
            { value: "head-office", label: "Addis Ababa Stadium" },
            { value: "bole", label: "Bole Clinical Hub" },
            { value: "kera", label: "Kera Downtown" },
            { value: "bethzatha", label: "Betezatha Center" },
          ].map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role</Label>
        <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="h-11 bg-muted/40 border-border/80 rounded-xl text-sm">
          <option value="">Select role...</option>
          {[
            { value: "manager", label: "Global Director" },
            { value: "optometrist", label: "Lead Optometrist" },
            { value: "receptionist", label: "Client Relations" },
            { value: "technician", label: "Lab Technician" },
            { value: "sales", label: "Sales Specialist" },
          ].map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </div>

      <FormInput label="Position Title" id="position" value={formData.position} onChange={(v) => setFormData({ ...formData, position: v })} placeholder="e.g. Lead Optometrist" icon={Briefcase} />

      {error && (
        <div className="text-xs font-bold text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/15">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-border/40">
        <Button type="submit" disabled={loading} className="flex-1 h-11 bg-primary hover:bg-primary-hover font-bold text-xs uppercase tracking-widest shadow-md">
          {loading ? "Provisioning..." : "Finalize Enrollment"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6 font-bold text-xs uppercase tracking-widest">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function FormInput({ label, id, type = "text", value, onChange, placeholder, icon: Icon }: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon: any;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-11 h-11 bg-muted/30 border-border/80 focus:bg-card transition-all text-sm font-semibold rounded-xl"
          required
        />
      </div>
    </div>
  );
}
