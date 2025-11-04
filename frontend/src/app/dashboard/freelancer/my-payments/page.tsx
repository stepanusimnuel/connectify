"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

interface Transaction {
  id: number;
  job?: { title: string };
  type: "REVENUE" | "EXPENSE";
  amount: number;
  status: "POTENTIAL" | "PENDING" | "SUCCESS";
  createdAt: string;
}

interface PaymentSummary {
  potential: number;
  pending: number;
  success: number;
}

interface PaymentStat {
  month: string;
  revenue: number;
  expense: number;
}

export default function MyPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<PaymentSummary>({
    potential: 0,
    pending: 0,
    success: 0,
  });
  const [chartData, setChartData] = useState<PaymentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const [summaryRes, statsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/summary`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        const summaryData = await summaryRes.json();
        const statsData = await statsRes.json();

        // Pastikan format data sesuai
        setTransactions(summaryData.transactions || []);
        setTotals(summaryData.totals || { potential: 0, pending: 0, success: 0 });
        setChartData(
          statsData.length
            ? statsData.map((d: any) => ({
                month: `${d.month}-${d.year}`,
                revenue: d.revenue ?? 0,
                expense: d.expense ?? 0,
              }))
            : []
        );
      } catch (err) {
        console.error("Failed to fetch payment data:", err);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4 text-[#121224]">My Payments</h1>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 border rounded-xl">
          <p className="font-semibold">Potential</p>
          <p className="text-2xl text-yellow-600 font-bold">Rp {(totals.potential ?? 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-blue-50 border rounded-xl">
          <p className="font-semibold">Pending</p>
          <p className="text-2xl text-blue-600 font-bold">Rp {(totals.pending ?? 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-green-50 border rounded-xl">
          <p className="font-semibold">Success</p>
          <p className="text-2xl text-green-600 font-bold">Rp {(totals.success ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {/* 🔹 Chart Section */}
      <div className="bg-white rounded-2xl shadow p-6 border border-[#E7E7F1]/30">
        <h2 className="text-lg font-semibold mb-4 text-[#121224]">Revenue & Expense Chart</h2>

        {statsLoading ? (
          <p className="text-gray-500">Loading chart data...</p>
        ) : chartData.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No chart data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🔹 History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No transactions yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Job</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{t.job?.title || "-"}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">Rp {t.amount.toLocaleString()}</td>
                  <td className={`p-2 font-semibold ${t.status === "SUCCESS" ? "text-green-600" : t.status === "PENDING" ? "text-blue-600" : "text-yellow-600"}`}>{t.status}</td>
                  <td className="p-2">{new Date(t.createdAt).toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
