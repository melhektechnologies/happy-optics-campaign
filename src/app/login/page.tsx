"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Panel: Branding / Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#010133] relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-[#012a2d] rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-[#C89A32]/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-2 text-white">
          <ShoppingCart className="h-8 w-8 text-[#C89A32]" />
          <span className="text-2xl font-bold tracking-tight">SuperNova</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold text-white leading-tight">
            The intelligent operating system for modern retail.
          </h1>
          <p className="text-slate-300 text-lg">
            Manage your inventory, optimize your checkout flow, and scale your multi-branch operations from a single pane of glass.
          </p>
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-[#010133] bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">SJ</div>
              <div className="h-10 w-10 rounded-full border-2 border-[#010133] bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">MC</div>
              <div className="h-10 w-10 rounded-full border-2 border-[#010133] bg-slate-400 flex items-center justify-center text-xs font-bold text-slate-600">AP</div>
            </div>
            <p className="text-sm text-slate-400">Join 10,000+ retail professionals.</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-slate-500">© 2026 SuperNova Technologies Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-3 px-0">
            <div className="flex items-center gap-2 text-[#010133] lg:hidden mb-4">
              <ShoppingCart className="h-6 w-6 text-[#012a2d]" />
              <span className="text-xl font-bold tracking-tight">SuperNova</span>
            </div>
            <CardTitle className="text-3xl font-bold text-[#010133]">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access the terminal.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@supermarket.com" 
                  required 
                  className="h-12 bg-white border-slate-200 focus-visible:ring-[#012a2d]"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#012a2d] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="h-12 bg-white border-slate-200 focus-visible:ring-[#012a2d]"
                />
              </div>
              <Button type="button" className="w-full h-12 text-lg bg-[#010133] hover:bg-[#012a2d] text-white rounded-xl shadow-lg shadow-[#010133]/20 transition-all hover:scale-[1.02]">
                Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google Workspace
            </Button>

            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Enterprise-grade secure authentication</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
