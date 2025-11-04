"use client";

import React, { useEffect, useState } from "react";
import WorkerCard from "./WorkerCard";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const TopWorkers: React.FC<{ title?: string }> = ({ title = "Connectify's Top Workers" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = workers.filter((worker) => (worker.totalJobs ?? 0) > 1);

  const shownWorkers = filtered.length < 6 ? filtered : filtered.slice(0, 6);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/freelancers/`;
        const params: string[] = [];

        if (params.length > 0) url += `?${params.join("&")}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        setWorkers(data);
      } catch (err) {
        console.error("Error fetching top workers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleViewAll = () => {
    router.push("/dashboard/browse-freelancers");
  };

  return (
    <section id="projects" className="w-full pb-26">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#01367B]">{title}</h2>
        <div className="flex gap-8">
          {/* View All Button */}
          <button onClick={handleViewAll} className={`px-12 py-3 text-sm font-medium rounded-md border border-gray-300 transition bg-white hover:bg-[#B0CFF5] }`}>
            View All
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shownWorkers.map((worker, i) => (
            <WorkerCard
              key={i}
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
    </section>
  );
};

export default TopWorkers;
