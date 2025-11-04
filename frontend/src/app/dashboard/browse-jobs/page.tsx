"use client";

import React, { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Job {
  id: number;
  title: string;
  specialty: string;
  location: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  image?: string;
  applicationDeadline: Date;
  contractDeadline: Date;
  status: "OPEN" | "CLOSED" | "COMPLETED" | "ONGOING";
  createdAt: Date;
  type: string;
  company: {
    name: string;
    profilePic?: string;
    totalJobs: number;
    specialty: string;
    location: string;
    description: string;
    createdAt: Date;
    email: string;
  };
}

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(9999999);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/projects/company/job`);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const specialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      const key = j.specialty || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      const key = j.location || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const filtered = jobs
    .filter((j) => (search ? j.title.toLowerCase().includes(search.toLowerCase()) : true))
    .filter((j) => (selectedSpecialties.length > 0 ? selectedSpecialties.includes(j.specialty || "Unknown") : true))
    .filter((j) => (selectedLocations.length > 0 ? selectedLocations.includes(j.location || "Unknown") : true))
    .filter((j) => j.minSalary >= minSalary && j.maxSalary <= maxSalary);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]));
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-24 mt-6">
        <h1 className="text-3xl font-semibold text-[#303030]">Job Search</h1>
        <span className="text-sm text-[#5E6670]">Search your desired job matching your skills</span>

        <div className="flex justify-between items-center shadow rounded-lg mt-8">
          <div className="flex items-center gap-3 w-full">
            <input type="text" placeholder="Search job title | Enter location" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 ps-14 pe-6 py-5 border-2 rounded-lg text-[#808080] border-[#B0CFF5] outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Left Filters */}
        <div className="w-1/4">
          <h2 className="text-xl font-semibold mb-8">Filter</h2>
          <div className="bg-[#B0CFF5]/13 border border-[#B0CFF5] shadow px-6 py-12 rounded-lg space-y-8">
            {/* Salary Range */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Salary Range</label>
              <div className="mt-3 flex gap-3">
                <input type="number" value={minSalary} min={0} onChange={(e) => setMinSalary(Number(e.target.value))} className="w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500 font-light" placeholder="Min" />
                <input type="number" value={maxSalary} min={0} onChange={(e) => setMaxSalary(Number(e.target.value))} className="w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500 font-light" placeholder="Max" />
              </div>
            </div>

            {/* Specialty */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Specialty</label>
              <ul className="mt-3 space-y-2">
                {Object.entries(specialtyCounts).map(([spec, count]) => (
                  <li key={spec}>
                    <button
                      onClick={() => toggleSpecialty(spec)}
                      className={`flex justify-between items-center w-full text-left py-2 px-3 rounded-md ${selectedSpecialties.includes(spec) ? "bg-[#B0CFF5] text-[#01367B]" : "hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedSpecialties.includes(spec)} readOnly className="w-5 h-5" />
                        <span className="text-sm">{spec}</span>
                      </div>
                      <span className="text-gray-500 text-xs">({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div>
              <label className="font-semibold text-gray-[#303030]">Location</label>
              <ul className="mt-3 space-y-2">
                {Object.entries(locationCounts).map(([loc, count]) => (
                  <li key={loc}>
                    <button onClick={() => toggleLocation(loc)} className={`flex justify-between items-center w-full text-left py-2 px-3 rounded-md ${selectedLocations.includes(loc) ? "bg-[#B0CFF5] text-[#01367B]" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedLocations.includes(loc)} readOnly className="w-5 h-5" />
                        <span className="text-sm">{loc}</span>
                      </div>
                      <span className="text-gray-500 text-xs">({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="w-3/4">
          <h2 className="text-xl font-semibold mb-8">Available Jobs ({filtered.length})</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
