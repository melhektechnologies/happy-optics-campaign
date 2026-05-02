"use client";

import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Data
const revenueData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
];

const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

const recentSales = [
  { id: "1", customer: "John Doe", email: "john@example.com", amount: "+$1,999.00", status: "Completed" },
  { id: "2", customer: "Alice Smith", email: "alice@example.com", amount: "+$39.00", status: "Completed" },
  { id: "3", customer: "Bob Johnson", email: "bob@example.com", amount: "+$299.00", status: "Completed" },
  { id: "4", customer: "Emma Davis", email: "emma@example.com", amount: "+$99.00", status: "Completed" },
  { id: "5", customer: "Michael Wilson", email: "michael@example.com", amount: "+$39.00", status: "Completed" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your stores today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600">Live Updates Active</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <Card className="border-none shadow-md shadow-slate-200/50 bg-gradient-to-br from-[#012a2d] to-[#010133] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#C89A32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Sales Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-[#012a2d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#010133]">+2350</div>
            <p className="text-xs text-green-500 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-[#012a2d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#010133]">+12,234</div>
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Low Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-[#012a2d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#010133]">24</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              Items need immediate restock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#010133]">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue performance across all branches.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#012a2d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#012a2d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="total" stroke="#012a2d" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#010133]">Weekly Sales</CardTitle>
            <CardDescription>Daily sales volume for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sales" fill="#010133" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#010133]">Recent Transactions</CardTitle>
            <CardDescription>Latest sales across all checkout terminals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[#012a2d] font-bold">
                      {sale.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none text-[#010133]">{sale.customer}</p>
                      <p className="text-sm text-slate-500 mt-1">{sale.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{sale.amount}</p>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 mt-1">
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold text-sm">AI Insights</span>
            </div>
            <CardTitle className="text-[#010133]">Smart Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                <h4 className="font-semibold text-[#010133] text-sm">Demand Forecast Alert</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Expected 45% surge in beverage sales this weekend due to local heatwave. Consider adjusting stock levels for Branch A.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                <h4 className="font-semibold text-[#010133] text-sm">Inventory Optimization</h4>
                <p className="text-sm text-slate-600 mt-1">
                  "Organic Produce" category is seeing 20% higher return rates. Recommend auditing supplier quality for next batch.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
