"use client";

import { BarChart3, Download, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const data = [
  { name: "Week 1", revenue: 4000, profit: 2400 },
  { name: "Week 2", revenue: 3000, profit: 1398 },
  { name: "Week 3", revenue: 2000, profit: 9800 },
  { name: "Week 4", revenue: 2780, profit: 3908 },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Advanced Reports</h1>
          <p className="text-slate-500 mt-1">Generate and view financial and operational analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button className="bg-[#012a2d] hover:bg-[#010133] text-white shadow-md">
            Generate New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm bg-white hover:border-[#012a2d]/30 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 font-medium">Sales Report</CardTitle>
            <BarChart3 className="h-5 w-5 text-[#012a2d] mt-2" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">Daily, weekly, and monthly sales breakdowns.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:border-[#012a2d]/30 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 font-medium">Inventory Valuation</CardTitle>
            <PieChart className="h-5 w-5 text-[#C89A32] mt-2" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">Current stock value and dead stock analysis.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:border-[#012a2d]/30 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 font-medium">Tax & VAT</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-500 mt-2" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">Automated tax calculations for filing.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-[#012a2d] to-[#010133] text-white cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-200 font-medium flex items-center justify-between">
              Custom Report
              <span className="h-2 w-2 rounded-full bg-[#C89A32] animate-pulse"></span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-300 mt-5">Use AI to generate a custom KPI dashboard.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm col-span-4 mt-4">
        <CardHeader>
          <CardTitle className="text-[#010133]">Monthly Performance vs Profit</CardTitle>
          <CardDescription>Visual correlation between gross revenue and net profit margins.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#012a2d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#012a2d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C89A32" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C89A32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#012a2d" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" stroke="#C89A32" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
