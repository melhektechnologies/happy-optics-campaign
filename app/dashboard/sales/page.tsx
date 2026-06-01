"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Search, 
  Plus,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  Package,
  Activity,
  Download,
  Wallet,
  Receipt,
  BarChart3,
  Banknote,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

interface Sale {
  id: string;
  patient_id: string;
  patient_name: string;
  sale_date: string;
  total_amount: number;
  items: string;
  payment_method: string;
  branch: string;
  created_at: string;
}

const paymentColors: Record<string, string> = {
  cash: "bg-emerald-100 text-emerald-700 border-emerald-200",
  card: "bg-blue-100 text-blue-700 border-blue-200",
  transfer: "bg-violet-100 text-violet-700 border-violet-200",
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("month");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    if (role && role !== "manager") {
      window.location.href = `/dashboard`;
      return;
    }
    fetchSales();
  }, [dateRange]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/dashboard/sales?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((sale) =>
    sale.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const averageSale = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
  const highestSale = filteredSales.length > 0 ? Math.max(...filteredSales.map(s => s.total_amount)) : 0;

  const chartData = filteredSales
    .reduce((acc, sale) => {
      const date = new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + sale.total_amount;
      return acc;
    }, {} as Record<string, number>);

  const chartDataArray = Object.entries(chartData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const DATE_RANGES = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-7 page-container">

      {/* ─── Hero Banner ─── */}
      <div className="page-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-4 w-4 text-primary/70" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Financial Intelligence</span>
            </div>
            <h1 className="page-title">Revenue Console</h1>
            <p className="page-subtitle">Real-time transactional data and fiscal performance analytics.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export Ledger
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover shadow-md glow-primary">
              <Link href="/dashboard/sales/new">
                <Plus className="mr-2 h-4 w-4" />
                Process Sale
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            label: "Total Revenue",
            value: `ETB ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
            sub: `From ${filteredSales.length} transactions`,
            bg: "bg-primary/10 text-primary",
          },
          {
            label: "Average Transaction",
            value: `ETB ${averageSale.toFixed(0)}`,
            icon: Activity,
            trend: "-2.1%",
            trendUp: false,
            sub: "Per sale average",
            bg: "bg-accent/10 text-accent",
          },
          {
            label: "Highest Sale",
            value: `ETB ${highestSale.toLocaleString()}`,
            icon: TrendingUp,
            trend: "+5",
            trendUp: true,
            sub: "Single transaction record",
            bg: "bg-success-light/50 text-success",
          },
        ].map((stat, i) => (
          <div key={i} className="premium-card stat-card group p-6 gradient-border">
            <div className="flex items-start justify-between mb-5">
              <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300", stat.bg)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold flex items-center gap-1",
                  stat.trendUp
                    ? "bg-success-light/40 text-success border-success/15"
                    : "bg-warning-light/40 text-warning border-warning/15"
                )}
              >
                {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              {loading
                ? <Skeleton className="h-8 w-40 shimmer-loader" />
                : <h3 className="text-2xl font-black tracking-tight gradient-text">{stat.value}</h3>
              }
              <p className="text-[10px] text-muted-foreground pt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Revenue Chart ─── */}
      <div className="premium-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/40 bg-muted/[0.03]">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Revenue Trend
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Transactional flux over selected period</p>
          </div>
          <div className="flex p-1 bg-muted/50 rounded-xl gap-1 border border-border/40">
            {DATE_RANGES.map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id as any)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                  dateRange === range.id
                    ? "bg-card shadow-sm border border-border/50 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <Skeleton className="h-[300px] w-full shimmer-loader rounded-xl opacity-40" />
          ) : chartDataArray.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartDataArray}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b6e72" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0b6e72" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  fontWeight={700}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  fontWeight={700}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `ETB ${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '12px 16px',
                  }}
                  itemStyle={{ color: 'var(--primary)', fontSize: '12px', fontWeight: '800' }}
                  labelStyle={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0b6e72"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#0b6e72' }}
                  name="Revenue (ETB)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground/40">
              <Activity className="h-10 w-10 mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">No data for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Transaction Ledger ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Transaction Ledger</h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{filteredSales.length} records</span>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Filter by patient name or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 bg-card border-border/60 rounded-xl text-sm shadow-xs"
          />
        </div>

        {/* Sale rows */}
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full shimmer-loader rounded-xl" />
          ))
        ) : filteredSales.length === 0 ? (
          <div className="empty-state premium-card border-dashed py-16">
            <Receipt className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No transactions found</p>
          </div>
        ) : (
          filteredSales.map((sale, idx) => (
            <div
              key={sale.id}
              className="premium-card group hover:border-primary/20 transition-all"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary flex items-center justify-center border border-primary/10 shrink-0 group-hover:scale-105 transition-transform">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-bold truncate">{sale.patient_name}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-black uppercase tracking-tighter border",
                            paymentColors[sale.payment_method.toLowerCase()] || "text-muted-foreground border-border/60"
                          )}
                        >
                          <CreditCard className="h-2.5 w-2.5 mr-0.5" />
                          {sale.payment_method}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span className="truncate">{sale.items}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          {sale.branch}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-none border-border/40">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">Amount</p>
                      <p className="text-xl font-black gradient-text tabular-nums">ETB {sale.total_amount.toLocaleString()}</p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-border/60 group-hover:border-primary/30">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
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
