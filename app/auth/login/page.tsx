"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, User, Building2, Sparkles, Activity } from "lucide-react";

export default function LoginPage() {
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
        body: JSON.stringify({ email, password, isManagerLink: true }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_role", data.role);
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#080c16] opacity-90" />
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] bg-accent/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 neural-grid opacity-[0.15]" />
      </div>

      <div className="w-full max-w-[420px] p-6 z-10 animate-in">
        
        {/* Logo & Header */}
        <div className="text-center mb-10 stagger">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_rgba(11,110,114,0.3)] mb-6 group relative">
            <div className="absolute inset-0 bg-primary opacity-50 blur-xl group-hover:opacity-80 transition-opacity duration-500 rounded-2xl" />
            <Sparkles className="h-7 w-7 text-white relative z-10 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Director Console</h1>
          <p className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Zero-Trust Environment · v2.0</p>
        </div>

        {/* Auth Card */}
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[28px] p-8 shadow-2xl relative overflow-hidden stagger">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">Global Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-mono"
                  placeholder="director@happyoptics.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block flex justify-between">
                <span>Security Token</span>
                <span className="text-primary hover:text-white cursor-pointer transition-colors">Forgot?</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-12 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-mono tracking-widest"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-in slideInRight text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? (
                "Authorizing..."
              ) : (
                <>
                  Initialize Protocol
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>

        <div className="mt-8 text-center stagger relative z-10 flex flex-col items-center gap-3">
           <Link href="/auth/login/staff" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md">
             <Building2 className="h-3 w-3" />
             Staff Terminal
           </Link>
           <p className="text-[9px] font-bold text-white/20 tracking-widest uppercase flex items-center gap-1.5 mt-2">
             <Activity className="h-2.5 w-2.5 text-primary" /> End-to-End Encrypted Handshake
           </p>
        </div>

      </div>
    </div>
  );
}
