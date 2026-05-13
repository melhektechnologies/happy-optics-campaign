"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const branchNames: Record<string, string> = {
  "head-office": "Head Office",
  "bole": "Bole Branch",
  "kera": "Kera Downtown",
  "bethzatha": "Betezatha",
  "manager": "Manager Portal",
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
      setError("Invalid branch");
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
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          expectedBranch: branch === "manager" ? null : branch,
        }),
      });

      let data: { user?: { role: string; branch: string }; error?: string };
      try {
        data = await response.json();
      } catch {
        setError("Server error: Invalid response from server. Please check your connection.");
        return;
      }

      if (response.ok && data.user) {
        // Server already validated role/branch via expectedBranch; the
        // session cookie is now set. We use the returned profile only for
        // routing — never as the source of truth for authorization.
        if (data.user.role === "manager") {
          router.push("/dashboard/manager");
        } else {
          router.push(`/dashboard/${data.user.branch}`);
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError("Cannot connect to server. Please check your internet connection and try again.");
      } else {
        setError(error instanceof Error ? error.message : "An error occurred. Please check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!branch || !branchNames[branch]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Invalid branch or access denied</p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative h-16 w-16">
              <Image
                src="/brand/happy-optics-logo.png"
                alt="Happy Optics Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">{branchName}</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="inline h-3 w-3 mr-1" />
                Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

