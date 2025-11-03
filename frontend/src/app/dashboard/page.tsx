"use client";

import React, { useEffect, useState } from "react";
import SummaryCard from "./components/Summary";
import ProjectChart from "./components/ProjectChart";
import TopWorkers from "@/components/landing/TopWorkers";
import Hero from "./components/Hero";

type Role = "COMPANY" | "FREELANCER";

interface SummaryData {
  activeProjects: number;
  ongoingContracts: number;
  pendingPayments: number;
  newApplicants: number;
}

export default function DashboardPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [summary, setSummary] = useState<SummaryData>({
    activeProjects: 0,
    ongoingContracts: 0,
    pendingPayments: 0,
    newApplicants: 0,
  });

  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user?.role) {
      const r = user.role.toUpperCase() as Role;
      setRole(r);

      // Dummy data, nanti bisa fetch dari backend
      if (r === "COMPANY") {
        setSummary({ activeProjects: 5, ongoingContracts: 3, pendingPayments: 2, newApplicants: 4 });
        setRevenueData([
          { month: "Jan", revenue: 1500 },
          { month: "Feb", revenue: 2800 },
          { month: "Mar", revenue: 3200 },
        ]);
      } else {
        setSummary({ activeProjects: 2, ongoingContracts: 1, pendingPayments: 1, newApplicants: 0 });
        setRevenueData([
          { month: "Jan", revenue: 800 },
          { month: "Feb", revenue: 1200 },
          { month: "Mar", revenue: 900 },
        ]);
      }
    }
  }, []);

  if (!role) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="text-center text-[#01367B]">
        <p className="my-2 text-sm">{role === "COMPANY" ? "Overview of company projects, payment and top talents" : "Overview of your projects, applications and earnings"}</p>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
      </div>

      <Hero />

      <section className="mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title={role === "COMPANY" ? "Active Projects" : "Applied Jobs"} value={summary.activeProjects} description={role === "COMPANY" ? "Job and course" : "Jobs you applied"} />
          <SummaryCard title="Ongoing Contracts" value={summary.ongoingContracts} description="Managed via Escrow" />
          <SummaryCard title="Pending Payments" value={summary.pendingPayments} description="Awaiting release" />
          <SummaryCard title={role === "COMPANY" ? "New Applicants" : "Completed Jobs"} value={summary.newApplicants} description="Waiting approval" />
        </div>
      </section>

      <section className="mt-16">
        <h3 className="text-2xl text-[#01367B] font-medium mb-4">Project & Course Performance</h3>
        <ProjectChart data={revenueData} />
      </section>

      {role === "COMPANY" && (
        <section className="mt-16">
          <TopWorkers title="Discover Top Freelancers" />
        </section>
      )}
    </div>
  );
}
