"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import ProjectCard from "../../components/ProjectCard";
import ProjectChart from "../../components/ProjectChart";

interface Project {
  id: number;
  title: string;
  description: string;
  type: "JOB" | "COURSE";
  status: string;
  paymentAmount: number | null;
  applications: {
    id: number;
    status: string;
    freelancer: { id: number; name: string; email: string } | null;
  }[];
  createdAt: string;
}

interface ChartData {
  month: string;
  revenue?: number;
  expenses?: number;
}

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        let res;
        if (user.role === "COMPANY") {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/company/all/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        } else {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/freelancer/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        }
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFinance = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/finance/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        const raw = await res.json();

        const chartArray: ChartData[] = Object.entries(raw).map(([key, val]: [string, any]) => ({
          month: key,
          revenue: val.revenue,
          expenses: val.expenses,
        }));
        setChartData(chartArray);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
    fetchFinance();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4 md:mb-0">My Projects</h1>

        {/* ✅ Tombol hanya muncul untuk COMPANY */}
        {user.role === "COMPANY" && (
          <Link href="/dashboard/company/my-projects/post" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150">
            + Post a Job
          </Link>
        )}
      </div>

      {/* Chart */}
      <ProjectChart data={chartData} />

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} isCompany={user.role === "COMPANY"} />
        ))}
      </div>
    </div>
  );
}
