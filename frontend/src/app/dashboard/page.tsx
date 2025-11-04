"use client";

import React, { useEffect, useState } from "react";
import SummaryCard from "./components/Summary";
import Hero from "./components/Hero";
import TopWorkers from "@/components/landing/TopWorkers";
import JobCard from "./components/JobCard";
import { useRouter } from "next/navigation";

interface SummaryData {
  activeProjects: number;
  pendingApplications: number;
  upcomingPayments: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [heroProject, setHeroProject] = useState<any>(null);
  const [summary, setSummary] = useState<SummaryData>({
    activeProjects: 0,
    pendingApplications: 0,
    upcomingPayments: 0,
  });
  const [topJobs, setTopJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hero Project
        const heroRes = await fetch(`${API_BASE}/api/dashboard/hero`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const heroData = await heroRes.json();
        setHeroProject(heroData);

        // Summary Cards
        const summaryRes = await fetch(`${API_BASE}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const summaryData = await summaryRes.json();
        console.log(summaryData);
        setSummary(summaryData);

        // Top Freelancers
        // const topWorkersRes = await fetch(`${API_BASE}/api/dashboard/top-freelancers`);
        // const topWorkersData = await topWorkersRes.json();
        // setTopFreelancers(topWorkersData);

        // Top Jobs
        // const topJobsRes = await fetch(`${API_BASE}/api/dashboard/top-jobs`);
        // const topJobsData = await topJobsRes.json();
        // setTopJobs(topJobsData);

        const jobRes = await fetch(`${API_BASE}/api/projects/company/job`);
        const jobData = await jobRes.json();
        setTopJobs(jobData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAll = () => {
    router.push("dashboard/browse-jobs");
  };

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <div className="text-center text-[#01367B]">
        <p className="my-2 text-sm">Overview of projects, applications, and payments</p>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
      </div>

      {/* Hero Section */}
      {heroProject ? <Hero project={heroProject} /> : <p className="text-center text-gray-500">No active project</p>}

      {/* Summary Cards */}
      <section className="mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Active Projects" value={summary.activeProjects} description="Ongoing jobs" />
          <SummaryCard title="Pending Applications" value={summary.pendingApplications} description="Awaiting response" />
          <SummaryCard title="Upcoming Payments" value={"IDR" + summary.upcomingPayments.toLocaleString()} description="Potential or pending" />
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="mt-16">
        <TopWorkers title="Top Freelancers" />
      </section>

      {/* Top Jobs */}
      <section className="mt-16 pb-16">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold text-[#01367B]">Newest Jobs</h2>
          <button onClick={handleViewAll} className="px-12 py-3 text-sm font-medium rounded-md border border-gray-300 transition bg-white hover:bg-[#B0CFF5]">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {topJobs.length > 0 ? topJobs.slice(0, Math.min(topJobs.length, 6)).map((job) => <JobCard key={job.id} job={job} />) : <p className="text-center text-gray-500 col-span-3">No jobs available</p>}
        </div>
      </section>
    </div>
  );
}
