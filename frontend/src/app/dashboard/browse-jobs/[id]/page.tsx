"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [expandCompany, setExpandCompany] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Ambil data user dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      }
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`${API_BASE}/api/projects/company/job/${id}`);
      const data = await res.json();
      setJob(data);
    };
    fetchJob();
  }, [id]);

  if (!job) return <p className="text-center mt-10">Loading job details...</p>;

  return (
    <div className="pb-30 mt-10">
      {/* Hero */}
      <div className="relative w-full h-100 bg-cover bg-center flex items-end" style={{ backgroundImage: `url(${job.image || "/dashboard/hero.png"})` }}>
        <div className="bg-black/50 w-full p-6 text-white">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p>
            {job.company.name} • {job.location}
          </p>
        </div>
      </div>

      {/* Job Info */}
      <div className=" mx-auto mt-10 space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold text-[#01367B]">Job Details</h2>
          {userRole !== "COMPANY" && <button className="font-medium bg-[#1F76E4] rounded text-sm text-white px-5 py-2 hover:bg-[#1F76E4]/60">Apply Now</button>}
        </div>

        <div>
          <p>
            <strong>Salary:</strong> {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()}
          </p>
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          <p>
            <strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Contract Deadline:</strong> {new Date(job.contractDeadline).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Expandable company info */}
        <div className="border rounded-lg p-5 bg-[#F8FAFD]">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandCompany(!expandCompany)}>
            <h3 className="font-semibold text-lg">About the Company</h3>
            {expandCompany ? <ChevronUp /> : <ChevronDown />}
          </div>
          {expandCompany && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <img src={job.company.profilePic || "/company.png"} alt="Company" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium text-[#01367B]">{job.company.name}</p>
                  <p className="text-sm text-gray-600">{job.company.location}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{job.company.description}</p>
              <p className="text-sm text-gray-500">Specialty: {job.company.specialty}</p>
              <p className="text-sm text-gray-500">Total Jobs Posted: {job.company.totalJobs}</p>
              <p className="text-sm text-gray-500">Email: {job.company.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
