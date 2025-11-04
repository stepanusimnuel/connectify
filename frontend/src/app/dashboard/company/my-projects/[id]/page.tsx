"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ApplicationList from "@/app/dashboard/components/ApplicationList";

interface Company {
  id: number;
  name: string;
  email: string;
  location: string;
}

interface Application {
  id: number;
  status: string;
  freelancer: { id: number; name: string; email: string };
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
  company: Company;
  applications: Application[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInput, setPaymentInput] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects/company/job/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const updateStatus = async (newStatus: string, extraData: Record<string, any> = {}) => {
    if (!job) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/company/job/${job.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...extraData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setJob(data.job);
      alert(data.message || "Status updated!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal memperbarui status job");
    } finally {
      setUpdating(false);
      setShowPaymentModal(false);
      setPaymentInput("");
    }
  };

  const handleStartProject = () => {
    if (!job) return;
    if (job.paymentAmount && job.paymentAmount > 0) {
      updateStatus("ONGOING", { paymentAmount: job.paymentAmount });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentInput) return alert("Masukkan nominal pembayaran");
    const amount = Number(paymentInput);
    if (isNaN(amount) || amount <= 0) return alert("Nominal tidak valid");
    if (job && (amount < job.minSalary || amount > job.maxSalary)) return alert("Payment harus dalam rentang gaji minimum dan maksimum");

    updateStatus("ONGOING", { paymentAmount: amount });
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={job.image ? (job.image.startsWith("http") ? job.image : `/uploads/${job.image}`) : "/image-preview-default.png"} alt={job.title} className="w-full md:w-1/2 h-64 object-cover rounded-xl" />

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <span className={`px-3 py-1 text-sm rounded-full text-white ${job.status === "OPEN" ? "bg-blue-500" : job.status === "CLOSED" ? "bg-gray-500" : job.status === "ONGOING" ? "bg-yellow-500" : "bg-green-600"}`}>{job.status}</span>
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
                <strong>Salary Range:</strong> IDR {job.minSalary.toLocaleString()} – IDR {job.maxSalary.toLocaleString()}
              </p>
              <p>
                <strong>Application Deadline:</strong> {formatDate(job.applicationDeadline)}
              </p>
              <p>
                <strong>Contract Deadline:</strong> {formatDate(job.contractDeadline)}
              </p>
              {job.paymentAmount && job.paymentAmount > 0 && (
                <p>
                  <strong>Payment Amount:</strong> IDR {job.paymentAmount.toLocaleString()}
                </p>
              )}
              <p>
                <strong>Company:</strong> {job.company?.name}
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Tombol aksi status */}
        <div className="mt-6 flex justify-end gap-3">
          {job.status === "OPEN" && (
            <button onClick={() => router.push(`/dashboard/company/my-projects/${job.id}/edit`)} className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Edit Job
            </button>
          )}

          {job.status === "CLOSED" && (
            <button onClick={handleStartProject} disabled={updating} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50">
              {updating ? "Processing..." : "Start Project"}
            </button>
          )}

          {job.status === "ONGOING" && (
            <button onClick={() => updateStatus("COMPLETED")} disabled={updating} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
              {updating ? "Processing..." : "Mark as Completed"}
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Daftar pelamar */}
      <div className="bg-gray-50 rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Applicants ({job.applications?.length || 0})</h2>
        <ApplicationList applications={job.applications} jobStatus={job.status} />
      </div>

      {/* 🔸 Modal Input Payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Masukkan Payment Amount</h3>
            <input
              type="number"
              min={job.minSalary}
              max={job.maxSalary}
              value={paymentInput}
              onChange={(e) => setPaymentInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder={`Rentang: ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Batal
              </button>
              <button onClick={handleConfirmPayment} disabled={updating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {updating ? "Menyimpan..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
