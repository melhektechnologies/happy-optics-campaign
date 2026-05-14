"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// All recharts wrappers live here so the heavy bundle ships in a single
// dynamic chunk loaded only on dashboard pages that actually render charts.

const PIE_COLORS = ["#0d7377", "#14b8a6", "#0a5d61", "#1a1a1a"];

export interface AppointmentsByBranchDatum {
  branch: string;
  count: number;
  [key: string]: string | number;
}

export function AppointmentsByBranchChart({
  data,
  height = 300,
}: {
  data: AppointmentsByBranchDatum[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ branch, percent }: { branch?: string; percent?: number }) =>
            `${branch}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey="branch"
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export interface TrendDatum {
  date: string;
  count?: number;
  amount?: number;
}

export function AppointmentsTrendChart({
  data,
  height = 300,
}: {
  data: TrendDatum[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#0d7377"
          strokeWidth={2}
          name="Appointments"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesTrendChart({
  data,
  height = 300,
}: {
  data: TrendDatum[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#0d7377"
          strokeWidth={2}
          name="Revenue (ETB)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
