import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export default function JobCard({ job }: { job: any }) {
  const router = useRouter();
  const { token, user } = useAuth();
  const userRole = user?.role;
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  let status_style;
  if (job.status === "OPEN") status_style = "bg-blue-400";
  else if (job.status === "ONGOING") status_style = "bg-yellow-400";
  else if (job.status === "COMPLETED") status_style = "bg-green-400";
  else if (job.status === "CLOSED") status_style = "bg-red-400";

  useEffect(() => {
    if (!token || userRole !== "FREELANCER") return;

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/freelancer/job/${job.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data) setAlreadyApplied(true);
        }
      } catch (err) {
        console.error("Error checking application:", err);
      }
    })();
  }, [job.id, token, userRole]);

  const handleApply = async () => {
    if (!confirm("Are you sure you want to apply for this job?")) return;
    setApplying(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/freelancer/apply/${job.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply");

      alert("Apply success, status: pending");
      setAlreadyApplied(true);
      router.push("/dashboard/freelancer/my-projects");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="border border-[#B0CFF5] rounded-xl p-5 bg-white shadow hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#01367B] mb-2">{job.title}</h3>
        <span className={`${status_style}  text-sm font-medium text-white py-2 w-1/4 rounded text-center `}>{job.status}</span>
      </div>
      <div className="flex gap-2 items-center mb-6">
        <span className="font-semibold px-2 py-1 rounded-md bg-[#0BA02C]/10 text-[#0BA02C]">{new Date(job.contractDeadline).toLocaleDateString()}</span>
        <p className="text-sm">
          💰Salary: IDR{job.minSalary.toLocaleString()} - IDR{job.maxSalary.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <img src={job.company.profilePic || "/company.png"} alt="Company" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm text-gray-600">{job.company.name}</p>
          <div className="flex gap-2 items-center">
            <MapPin size={16} /> {job.location}
          </div>
        </div>
      </div>

      <div className="flex mt-5 justify-evenly">
        <Link href={`/dashboard/browse-jobs/${job.id}`} className="w-2/5 flex items-center bg-white text-[#303030] border border-[#1F76E4] py-2 justify-center rounded text-sm font-medium hover:bg-slate-300/60">
          View Details
        </Link>
        {userRole === "FREELANCER" && job.status === "OPEN" && (
          <button
            onClick={handleApply}
            disabled={applying || alreadyApplied}
            className={`w-2/5 font-medium py-2 px-6 rounded text-sm transition ${alreadyApplied ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#1F76E4] text-white hover:bg-[#1F76E4]/60"}`}
          >
            {applying ? "Applying..." : alreadyApplied ? "Already Applied" : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
}
