"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard";
import ProjectChart from "../../components/ProjectChart";
import { useAuth } from "@/app/context/AuthContext";

interface Job {
  title: string;
  type: "JOB" | "COURSE";
  companyId: number;
  description: string;
  minSalary?: number;
  maxSalary?: number;
  paymentAmount?: number;
  location?: string;
}

interface Application {
  id: number;
  status: string;
  createdAt: string;
  jobs: Job[];
}

export default function FreelancerMyProjectsPage() {
  const { user } = useAuth();
  const id = user?.id;
  const [applications, setApplications] = useState<Application[]>([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/freelancer/${id}`);
    const finance = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/finance/${id}`);
    console.log(res.data);
    const formattedProjects = res.data.map((app: any) => ({
      ...app.job,
      applicationStatus: app.status,
    }));
    console.log(formattedProjects);
    setApplications(formattedProjects);
    setChartData(finance.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Projects</h1>

      <ProjectChart data={chartData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((p) => (
          <ProjectCard key={p.id} project={p} isCompany={user.role === "COMPANY"} />
        ))}
      </div>
    </div>
  );
}
