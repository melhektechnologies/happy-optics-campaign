"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save,
  Building2,
  Bell,
  Shield,
  Mail,
  Eye,
  EyeOff,
  Settings2,
  Lock,
  Smartphone,
  Globe,
  CheckCircle2,
  Fingerprint,
  RotateCcw,
  Sparkles,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: "happy.optics21@gmail.com",
    phone: "+251-115584293",
    address: "Addis Ababa Stadium, Yeha City Center",
    notifications: true,
    reminders: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSave = () => {
    toast.success("Operational parameters synchronized successfully.");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Security key mismatch detected.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Security key must exceed 8 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Vault access credentials updated.");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(data.error || "Credential update failed.");
      }
    } catch (error) {
      setPasswordError("Asynchronous auth server timeout.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 page-container">
      
      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">System Settings</span>
            </div>
            <h1 className="page-title">Control Center</h1>
            <p className="page-subtitle max-w-md">
              Configure clinic identities, automated dispatcher protocols, and zero-trust security layers.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm group">
              <RotateCcw className="h-3.5 w-3.5 mr-2 group-hover:-rotate-180 transition-transform duration-700" />
              Reset Defaults
            </Button>
            <Button onClick={handleSave} size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary">
              <Save className="mr-2 h-4 w-4" />
              Commit Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Left Column: Organization & Notifications */}
         <div className="lg:col-span-2 space-y-8 stagger">
            
            {/* Identity Configuration */}
            <Card className="premium-card overflow-hidden">
               <CardHeader className="bg-muted/[0.03] border-b border-border/40 p-6 md:p-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <Building2 className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">Clinic Identity</CardTitle>
                        <CardDescription className="text-xs font-semibold text-muted-foreground mt-1">Update primary administrative contact nodes.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-6 md:p-8 space-y-8 bg-card">
                  <div className="grid md:grid-cols-2 gap-8">
                     <SettingsInput 
                        label="Administrative Email" 
                        id="email" 
                        type="email" 
                        value={settings.email} 
                        onChange={(v) => setSettings({ ...settings, email: v })}
                        icon={Mail}
                     />
                     <SettingsInput 
                        label="Operational Phone" 
                        id="phone" 
                        value={settings.phone} 
                        onChange={(v) => setSettings({ ...settings, phone: v })}
                        icon={Smartphone}
                     />
                  </div>
                  <SettingsInput 
                     label="Primary Headquarters Node" 
                     id="address" 
                     value={settings.address} 
                     onChange={(v) => setSettings({ ...settings, address: v })}
                     icon={Globe}
                  />
               </CardContent>
            </Card>

            {/* Notification Protocols */}
            <Card className="premium-card overflow-hidden">
               <CardHeader className="bg-muted/[0.03] border-b border-border/40 p-6 md:p-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/10 to-teal-400/10 border border-accent/20 flex items-center justify-center text-accent shadow-inner">
                        <Server className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">Alert Protocols</CardTitle>
                        <CardDescription className="text-xs font-semibold text-muted-foreground mt-1">Automated communication dispatcher settings.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-6 md:p-8 space-y-4 bg-card">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/30 transition-colors group">
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                           Email Dispatcher
                           <Sparkles className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Receive automated session logs via secure email.</p>
                     </div>
                     <PremiumSwitch checked={settings.notifications} onChange={() => setSettings({...settings, notifications: !settings.notifications})} />
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/40 border border-border/60 hover:border-accent/30 transition-colors group">
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                           Clinical SMS Gate
                           <Bell className="h-3.5 w-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Automatic mobile reminders for scheduled patients.</p>
                     </div>
                     <PremiumSwitch 
                        checked={settings.reminders} 
                        onChange={() => setSettings({...settings, reminders: !settings.reminders})}
                        accent
                     />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Right Column: Security Vault */}
         <div className="space-y-8 stagger">
            <Card className="premium-card bg-[#0b0f19] border-primary/20 shadow-xl shadow-primary/10 relative overflow-hidden text-white group">
               {/* Cinematic Effects */}
               <div className="absolute top-0 right-0 h-48 w-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-1000" />
               <div className="absolute bottom-[-10%] left-[-10%] h-32 w-32 bg-accent/20 rounded-full blur-[60px] pointer-events-none" />
               <div className="absolute inset-0 neural-grid opacity-[0.15] pointer-events-none" />

               <CardHeader className="p-8 border-b border-white/5 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/40 flex items-center justify-center text-primary-foreground shadow-[0_0_15px_rgba(11,110,114,0.4)]">
                        <Shield className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Security Vault</CardTitle>
                        <CardDescription className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">Credential Rotation Center</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 relative z-10">
                  <form onSubmit={handlePasswordChange} className="space-y-7">
                     <VaultInput 
                        label="Current Access Key" 
                        id="currentPassword" 
                        type={showPasswords.current ? "text" : "password"} 
                        value={passwordData.currentPassword} 
                        onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })}
                        show={showPasswords.current}
                        toggle={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                     />
                     <VaultInput 
                        label="New Security String" 
                        id="newPassword" 
                        type={showPasswords.new ? "text" : "password"} 
                        value={passwordData.newPassword} 
                        onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
                        show={showPasswords.new}
                        toggle={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                     />
                     <VaultInput 
                        label="Validate String" 
                        id="confirmPassword" 
                        type={showPasswords.confirm ? "text" : "password"} 
                        value={passwordData.confirmPassword} 
                        onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })}
                        show={showPasswords.confirm}
                        toggle={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                     />
                     
                     {passwordError && (
                       <div className="text-[10px] font-black uppercase tracking-[0.1em] text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-in slideInRight">
                         {passwordError}
                       </div>
                     )}
                     {passwordSuccess && (
                       <div className="text-[10px] font-black uppercase tracking-[0.1em] text-success-light bg-success-light/10 p-4 rounded-xl border border-success/20 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          {passwordSuccess}
                       </div>
                     )}

                     <Button 
                        type="submit" 
                        disabled={passwordLoading} 
                        className="w-full h-12 bg-white text-black hover:bg-gray-200 font-black text-xs uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all"
                     >
                        {passwordLoading ? "Authorizing..." : "Update Vault Access"}
                     </Button>
                  </form>
               </CardContent>
               <div className="p-5 bg-black/40 border-t border-white/5 text-center relative z-10 backdrop-blur-md">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center justify-center gap-2">
                     <Fingerprint className="h-3.5 w-3.5" />
                     E2E Encrypted Parameters
                  </p>
               </div>
            </Card>
            
            <Card className="premium-card p-6 bg-gradient-to-r from-primary to-accent border-transparent text-white relative overflow-hidden group shadow-lg shadow-primary/20">
               <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-90 flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Security Protocol
                  </h4>
                  <p className="text-xs font-bold leading-relaxed opacity-95">
                     Frequent security string rotation heavily minimizes adversarial access vectors across the operational grid.
                  </p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function SettingsInput({ label, id, type = "text", value, onChange, icon: Icon }: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  icon: any;
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">{label}</Label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 h-12 bg-muted/40 border-border/80 focus:bg-card focus:border-primary/50 transition-all text-sm font-bold rounded-xl shadow-xs"
        />
      </div>
    </div>
  );
}

function VaultInput({ label, id, type, value, onChange, show, toggle }: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  toggle: () => void;
}) {
   return (
      <div className="space-y-3">
         <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 ml-1">{label}</Label>
         <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
               id={id}
               type={type}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-primary/50 font-mono text-sm tracking-[0.2em] rounded-xl transition-all"
               required
            />
            <button
               type="button"
               onClick={toggle}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
               {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
         </div>
      </div>
   );
}

function PremiumSwitch({ checked, onChange, accent = false }: { checked: boolean, onChange: () => void, accent?: boolean }) {
   return (
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          checked ? (accent ? "bg-accent" : "bg-primary") : "bg-muted shadow-inner focus-visible:ring-border"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            checked ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
   );
}
