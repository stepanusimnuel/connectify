import React from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function JobCard({ job }: { job: any }) {
  const router = useRouter();

  return (
    <div className="border border-[#B0CFF5] rounded-xl p-5 bg-white shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[#01367B] mb-2">{job.title}</h3>
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
        <Link href={`/dashboard/browse-jobs/${job.id}`} className="w-2/5 bg-white text-[#303030] border border-[#1F76E4] py-2 px-6 text-center rounded text-sm font-medium hover:bg-slate-300/60">
          View Details
        </Link>
        <button className="w-2/5 font-medium bg-[#1F76E4] text-white py-2 px-6 rounded text-sm hover:bg-[#1F76E4]/60">Apply Now</button>
      </div>
    </div>
  );
}
