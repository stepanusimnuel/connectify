"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  month: string;
  revenue?: number;
  expense?: number;
}

export default function ProjectChart({ data }: { data: any }) {
  const chartArray: ChartData[] = Array.isArray(data)
    ? data
    : Object.entries(data || {}).map(([month, val]: [string, any]) => ({
        month,
        revenue: val.revenue || 0,
        expense: val.expense || 0,
      }));

  return (
    <div className="w-full h-80 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-3">Financial Overview</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartArray}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
