import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Boxes, ShoppingCart, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-[#012a2d]" />
            <span className="text-xl font-bold tracking-tight text-[#010133]">
              SuperNova
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-[#012a2d]">
              Features
            </Link>
            <Link href="#solutions" className="text-sm font-medium text-slate-600 hover:text-[#012a2d]">
              Solutions
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-[#012a2d]">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#010133]">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#012a2d] hover:bg-[#010133]">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-white to-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-[#012a2d]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-[#C89A32]/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                <Zap className="mr-2 h-4 w-4 text-[#C89A32]" />
                <span className="font-medium">The Future of Retail Management</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-[#010133] max-w-4xl">
                Smart Supermarket <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#012a2d] to-[#010133]">
                  Management System
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-slate-600 md:text-xl leading-relaxed">
                Enterprise-grade POS, inventory intelligence, and real-time analytics designed for modern hypermarkets and retail chains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-[#012a2d] hover:bg-[#010133] text-lg rounded-full shadow-lg shadow-[#012a2d]/20 transition-all hover:scale-105">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 transition-all">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                <div className="p-3 bg-[#012a2d]/10 rounded-xl">
                  <ShoppingCart className="h-8 w-8 text-[#012a2d]" />
                </div>
                <h3 className="text-xl font-bold text-[#010133]">Ultra-Fast POS</h3>
                <p className="text-slate-600">
                  Lightning-fast checkout experience with barcode scanning, offline mode, and multi-payment support.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                <div className="p-3 bg-[#012a2d]/10 rounded-xl">
                  <Boxes className="h-8 w-8 text-[#012a2d]" />
                </div>
                <h3 className="text-xl font-bold text-[#010133]">Inventory Intelligence</h3>
                <p className="text-slate-600">
                  Real-time stock tracking, automated reordering, and multi-branch warehouse management.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                <div className="p-3 bg-[#012a2d]/10 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-[#012a2d]" />
                </div>
                <h3 className="text-xl font-bold text-[#010133]">AI Analytics</h3>
                <p className="text-slate-600">
                  Predictive insights, demand forecasting, and visual dashboards for data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
