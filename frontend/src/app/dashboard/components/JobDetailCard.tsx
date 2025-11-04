"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Company {
  id: number;
  name: string;
  email: string;
  location: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  specialty: string;
  minSalary: number;
  maxSalary: number;
  image?: string;
  location: string;
  applicationDeadline: string;
  contractDeadline: string;
  status: "OPEN" | "CLOSED" | "ONGOING" | "COMPLETED";
  paymentAmount?: number | null;
  company?: Company;
}

interface Props {
  job: Job;
  context: "company" | "freelancer";
  applicationStatus?: string;
  onUnapply?: () => Promise<void> | void;
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
  onStart?: () => Promise<void> | void;
  onComplete?: () => Promise<void> | void;
  loading?: boolean;
}

export default function JobDetailCard({ job, context, applicationStatus, onUnapply, onEdit, onDelete, onStart, onComplete, loading = false }: Props) {
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const { token } = useAuth();
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (!job) {
    return <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">Loading job details...</div>;
  }

  // Helper: warna status job
  const statusColor = job.status === "OPEN" ? "bg-blue-500" : job.status === "CLOSED" ? "bg-gray-500" : job.status === "ONGOING" ? "bg-yellow-500" : "bg-green-600";

  // Helper: warna status aplikasi freelancer
  const appStatusColor = applicationStatus === "approved" ? "text-green-600" : applicationStatus === "rejected" ? "text-red-500" : "text-yellow-600";

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
      router.push("/dashboard/freelancer/my-projects");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      {/* Header Job */}
      <div className="flex flex-col md:flex-row gap-6">
        <img src={job.image ? (job.image.startsWith("http") ? job.image : `/uploads/${job.image}`) : "/image-preview-default.png"} alt={job.title} className="w-full md:w-1/2 h-64 object-cover rounded-xl" />

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <span className={`px-3 py-1 text-sm rounded-full text-white ${statusColor}`}>{job.status}</span>
          </div>

          <p className="text-gray-700">{job.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-4">
            <p>
              <strong>Specialty:</strong> {job.specialty}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Salary Range:</strong> IDR {job.minSalary?.toLocaleString()} – IDR {job.maxSalary?.toLocaleString()}
            </p>
            <p>
              <strong>Application Deadline:</strong> {formatDate(job.applicationDeadline)}
            </p>
            <p>
              <strong>Contract Deadline:</strong> {formatDate(job.contractDeadline)}
            </p>
            {job.paymentAmount && (
              <p>
                <strong>Payment:</strong> IDR {job.paymentAmount.toLocaleString()}
              </p>
            )}
            {job.company && (
              <p>
                <strong>Company:</strong> {job.company.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-6 flex justify-end gap-3 flex-wrap items-center">
        {context === "company" ? (
          <>
            {/* Edit */}
            <button
              onClick={onEdit}
              disabled={job.status !== "OPEN" || loading}
              className={`px-5 py-2 rounded-lg transition ${job.status === "OPEN" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              Edit Job
            </button>

            {/* Start */}
            <button
              onClick={onStart}
              disabled={job.status !== "CLOSED" || loading}
              className={`px-5 py-2 rounded-lg transition ${job.status === "CLOSED" ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              {loading ? "Processing..." : "Start Project"}
            </button>

            {/* Complete */}
            <button
              onClick={onComplete}
              disabled={job.status !== "ONGOING" || loading}
              className={`px-5 py-2 rounded-lg transition ${job.status === "ONGOING" ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              disabled={job.status !== "OPEN" || loading}
              className={`px-5 py-2 rounded-lg transition ${job.status === "OPEN" ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              Delete Job
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              <strong>Your Application Status:</strong> <span className={`font-semibold ${appStatusColor}`}>{applicationStatus || "-"}</span>
            </p>

            {job.status === "OPEN" && applicationStatus && (
              <button onClick={onUnapply} disabled={loading} className={`px-5 py-2 rounded-lg transition ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}>
                {loading ? "Processing..." : "Unapply"}
              </button>
            )}
            {job.status === "OPEN" && !applicationStatus && (
              <button onClick={handleApply} className={`font-medium py-2 px-6 rounded text-sm transition bg-[#1F76E4] text-white hover:bg-[#1F76E4]/60}`}>
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}
            {job.status !== "OPEN" && applicationStatus && <p className="text-sm text-gray-500 italic">You can only unapply if the job is still open.</p>}
          </>
        )}
      </div>
    </div>
  );
}
