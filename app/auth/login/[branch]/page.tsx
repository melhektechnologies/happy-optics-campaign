"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowLeft, ShieldCheck, Mail, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const branchNames: Record<string, string> = {
  "head-office": "Head Office Terminal",
  "bole": "Bole Clinic Interface",
  "kera": "Kera Operational Node",
  "bethzatha": "Betezatha Access Point",
  "manager": "Central Management Console",
};

export default function BranchLoginPage() {
  const router = useRouter();
  const params = useParams();
  const branch = params.branch as string;
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    if (branch && branchNames[branch]) {
      setBranchName(branchNames[branch]);
    } else {
      setError("Unauthorized access node.");
    }
  }, [branch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password: password, 
          expectedBranch: branch === "manager" ? null : branch 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success protocol
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_branch", data.branch || "");

        // Redirect based on telemetry role
        if (data.role === "manager") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Authentication failure detected.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network layer desynchronized. Please reconnect.");
    } finally {
      setLoading(false);
    }
  };

  if (!branch || !branchNames[branch]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 animate-in">
        <Card className="w-full max-w-sm border-dashed border-2">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Access Restricted</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">The requested operational branch node does not exist in our secure registry.</p>
            </div>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest h-11 border-border/80">
                <ArrowLeft className="mr-2 h-3 w-3" />
                Return to Surface
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 overflow-hidden relative selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,110,114,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(18,184,166,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/2 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="w-full max-w-md relative z-10 animate-in">
        <Card className="border-border/40 shadow-lg bg-card/70 backdrop-blur-xl rounded-[28px] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-8 px-8 border-b border-border/40 bg-muted/[0.03]">
            <div className="flex justify-center mb-6">
              <div className="relative group p-1 active:scale-95 transition-transform duration-300">
                <div className="absolute inset-0 bg-primary/20 rounded-[22px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-12 w-48 bg-card rounded-[22px] border border-border/60 shadow-sm flex items-center justify-center p-3 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                   <Image
                    src="/brand/happy-optics-logo.png"
                    alt="Happy Optics"
                    fill
                    className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                   />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 px-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Secure Protocol</p>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">{branchName}</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">Authorize your credentials to gain console access.</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 pt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2.5 group">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@happyoptics.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-muted/40 border-border/80 focus:bg-card transition-all text-sm font-medium rounded-xl"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2.5 group">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Key</Label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">Recover Access?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 bg-muted/40 border-border/80 focus:bg-card transition-all text-sm font-medium rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="animate-in flex items-center gap-3 p-4 bg-destructive/[0.03] border border-destructive/20 text-destructive rounded-xl shadow-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-[0.15em] shadow-md hover:shadow-lg transition-all active:scale-[0.98] rounded-xl" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Node...
                  </>
                ) : (
                  <>
                    Establish Connection
                    <ShieldCheck className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center pt-2">
                <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
                  <ArrowLeft className="h-3 w-3 mr-2 transition-transform group-hover:-translate-x-1" />
                  Return to Primary Surface
                </Link>
              </div>
            </form>
          </CardContent>
          
          <div className="bg-muted/[0.03] p-6 border-t border-border/40 text-center">
             <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">End-to-End Encrypted Terminal</p>
          </div>
        </Card>
        
        <p className="mt-8 text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] px-10 leading-relaxed">
          Proprietary healthcare intelligence console. Unauthorized access attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
}
