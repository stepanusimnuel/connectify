"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard";
import ProjectChart from "../../components/ProjectChart";

interface Project {
  id: number;
  title: string;
  type: "JOB" | "COURSE";
  status: string;
  companyId: number;
  createdAt: string;
  description: string;
  minSalary?: number;
  maxSalary?: number;
  paymentAmount?: number;
  location?: string;
}

export default function FreelancerMyProjectsPage() {
  const freelancerId = 1; // ambil dari auth context nanti
  const [projects, setProjects] = useState<Project[]>([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`/api/projects/freelancer/${freelancerId}`);
    const finance = await axios.get(`/api/projects/finance/${freelancerId}`);
    setProjects(res.data);
    setChartData(finance.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Projects (Freelancer)</h1>

      <ProjectChart data={chartData} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
