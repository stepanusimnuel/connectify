"use client";

import React, { useEffect, useMemo, useState } from "react";
import WorkerCard from "@/components/landing/WorkerCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Freelancer {
  id: number;
  name: string;
  specialty?: string;
  location?: string;
  description?: string;
  priceStart?: number;
  totalJobs?: number;
  rating?: number;
}

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minStartPrice, setMinStartPrice] = useState<number>(9999999);
  const [minRating, setMinRating] = useState<number>(0);
  const [minTotalJobs, setMinTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/freelancers`);
        const data = await res.json();
        setFreelancers(data);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, []);

  // Specialty count
  const specialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    freelancers.forEach((f) => {
      const key = f.specialty || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [freelancers]);

  // Location count
  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    freelancers.forEach((f) => {
      const key = f.location || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [freelancers]);

  // --- Filtering logic ---
  const filtered = freelancers
    .filter((f) => (search ? f.name.toLowerCase().includes(search.toLowerCase()) : true))
    .filter((f) => (selectedSpecialties.length > 0 ? selectedSpecialties.includes(f.specialty || "Unknown") : true))
    .filter((f) => (selectedLocations.length > 0 ? selectedLocations.includes(f.location || "Unknown") : true))
    .filter((f) => (f.priceStart ?? 0) <= minStartPrice)
    .filter((f) => (f.rating ?? 0) >= minRating)
    .filter((f) => (f.totalJobs ?? 0) >= minTotalJobs);

  // --- Handlers ---
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]));
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));
  };

  return (
    <div className="p-6 space-y-6 ">
      <div className="mb-24 mt-6">
        <h1 className="text-3xl font-semibold text-[#303030]">Discover Top Freelancers!</h1>
        <span className="text-sm text-[#5E6670]">Search for your desired job matching your skills</span>

        {/* 🔍 Search Bar */}
        <div className="flex justify-between items-center shadow rounded-lg mt-8">
          <div className="flex items-center gap-3 w-full">
            <input type="text" placeholder="Enter Name | Enter Location" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 ps-14 pe-6 py-5 border-2 rounded-lg text-[#808080] border-[#B0CFF5] outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* 🧩 Left Column — Filters */}
        <div className="w-1/4">
          <h2 className="text-xl font-semibold mb-8">Filter</h2>
          <div className=" bg-[#B0CFF5]/13 border border-[#B0CFF5] shadow px-6 py-12 rounded-lg space-y-8">
            {/* 💰 Start Price */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Start Price (Max)</label>
              <div className="mt-3">
                <input type="number" value={minStartPrice} min={0} onChange={(e) => setMinStartPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500 font-light" />
              </div>
            </div>

            {/* 🧠 Specialty */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Specialty</label>
              <ul className="mt-3 space-y-2">
                {Object.entries(specialtyCounts).map(([specialty, count]) => (
                  <li key={specialty}>
                    <button
                      onClick={() => toggleSpecialty(specialty)}
                      className={`flex justify-between items-center w-full text-left py-2 px-3 rounded-md ${selectedSpecialties.includes(specialty) ? "bg-[#B0CFF5] text-[#01367B]" : "hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedSpecialties.includes(specialty)} readOnly className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm">{specialty}</span>
                      </div>
                      <span className="text-gray-500 text-xs">({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 📍 Location */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Location</label>
              <ul className="mt-3 space-y-2">
                {Object.entries(locationCounts).map(([loc, count]) => (
                  <li key={loc}>
                    <button onClick={() => toggleLocation(loc)} className={`flex justify-between items-center w-full text-left py-2 px-3 rounded-md ${selectedLocations.includes(loc) ? "bg-[#B0CFF5] text-[#01367B]" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedLocations.includes(loc)} readOnly className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm">{loc}</span>
                      </div>
                      <span className="text-gray-500 text-xs">({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ⭐ Rating (min) */}
            <div className="pb-8 border-b-2 border-b-[#ACB2B9]">
              <label className="font-semibold text-gray-[#303030]">Minimum Rating</label>
              <div className="mt-3">
                <input type="number" min={0} max={5} step={0.1} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500 font-light" />
              </div>
            </div>

            {/* 🧾 Total Jobs */}
            <div>
              <label className="font-semibold text-gray-[#303030]">Minimum Total Jobs</label>
              <div className="mt-3">
                <input type="number" min={0} value={minTotalJobs} onChange={(e) => setMinTotalJobs(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-500 font-light" />
              </div>
            </div>
          </div>
        </div>

        {/* 🎴 Right Column — Freelancer Cards */}
        <div className="w-3/4">
          <h2 className="text-xl font-semibold mb-8">All Freelancers ({filtered?.length})</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No freelancers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  name={worker.name}
                  image="/freelancer-icon.png"
                  location={worker.location}
                  specialty={worker.specialty}
                  description={worker.description}
                  priceStart={worker.priceStart}
                  totalJobs={worker.totalJobs}
                  rating={worker.rating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
