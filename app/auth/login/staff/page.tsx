"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, User, Crown, ArrowLeft, Building2 } from "lucide-react";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isManagerLink: false }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_branch", data.branch || "");
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network timeout. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans">
      
      {/* Visual / Branding Side */}
      <div className="hidden lg:flex flex-1 relative bg-muted/30 items-center justify-center overflow-hidden border-r border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        <div className="absolute inset-0 neural-grid opacity-20" />
        <div className="relative z-10 w-full max-w-md p-12 text-center stagger">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white shadow-xl border border-border/60 mb-8 mx-auto group">
             <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                <Building2 className="h-8 w-8 text-white" />
             </div>
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-4">Happy Optics Network</h2>
          <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
            Welcome to the clinical operating system. Access your branch gateway to manage patients, schedule appointments, and process optical prescriptions with unparalleled efficiency.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[400px] animate-in">
          
          <Link href="/auth/login" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12">
            <ArrowLeft className="h-3 w-3 mr-1.5" /> Return to Directory
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Staff Gateway</h1>
            <p className="text-sm font-semibold text-muted-foreground">Enter your clinical credentials to access your branch node.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Staff ID / Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-muted/40 border border-border/80 rounded-xl pl-11 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-card focus:border-primary/50 transition-all font-mono"
                  placeholder="staff@happyoptics.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex justify-between">
                <span>Access Key</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-muted/40 border border-border/80 rounded-xl pl-11 pr-12 text-sm font-black text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-card focus:border-primary/50 transition-all tracking-widest font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/15 animate-in slideInRight">
                {error}
              </div>
            )}

            <button
               type="submit"
               disabled={loading}
               className="w-full h-12 bg-primary text-white font-black text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                "Authorizing..."
              ) : (
                <>
                  Enter Clinical Grid
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
             <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 hover:text-primary transition-colors hover:bg-primary/5 px-4 py-2 rounded-lg border border-transparent hover:border-primary/10">
               <Crown className="h-3 w-3" />
               Manager Override
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
