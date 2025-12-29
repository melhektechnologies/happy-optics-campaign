"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Search, 
  Plus,
  DollarSign,
  Calendar,
  TrendingUp
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("month");
  const [userRole, setUserRole] = useState<string>("");
  const [userBranch, setUserBranch] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("user_role") || "";
    const branch = localStorage.getItem("user_branch") || "";
    setUserRole(role);
    setUserBranch(branch);
    
    // Redirect non-manager users away from sales page
    if (role && role !== "manager") {
      const branch = localStorage.getItem("user_branch") || "";
      window.location.href = `/dashboard/${branch}`;
      return;
    }
    
    fetchSales();
  }, [dateRange]);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/dashboard/sales?range=${dateRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Prepare chart data
  const chartData = filteredSales
    .reduce((acc, sale) => {
      const date = new Date(sale.sale_date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.total_amount;
      return acc;
    }, {} as Record<string, number>);

  const chartDataArray = Object.entries(chartData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">
            {userRole === "manager" ? "Track sales and revenue" : "View sales"}
          </p>
        </div>
        {userRole === "manager" && (
          <Button asChild>
            <Link href="/dashboard/sales/new">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {filteredSales.length} sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSale.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSales.length}</div>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartDataArray.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#0d7377" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales by patient or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No sales found</p>
            </CardContent>
          </Card>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{sale.patient_name}</h3>
                      <Badge variant="outline">{sale.payment_method}</Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </div>
                      <div>
                        Items: {sale.items}
                      </div>
                      <div>
                        Branch: {sale.branch}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        ${sale.total_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

