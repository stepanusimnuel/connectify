"use client";

import { useState } from "react";

interface Freelancer {
  id: number;
  name: string;
  email?: string;
  profilePic?: string;
}

interface Application {
  id: number;
  status: string;
  freelancer: Freelancer;
  createdAt?: string;
}

interface Props {
  applications: Application[];
  jobStatus: string;
}

export default function ApplicationList({ applications, jobStatus }: Props) {
  const [appList, setAppList] = useState(applications);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleStatusUpdate = async (applicationId: number, newStatus: "approved" | "rejected") => {
    try {
      setLoadingId(applicationId);
      const res = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();

      if (newStatus === "approved") {
        // otomatis semua rejected kecuali yang di-approve
        setAppList((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: "approved" } : { ...app, status: "rejected" })));
      } else {
        // hanya ubah satu yang di-reject
        setAppList((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: "rejected" } : app)));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Applicants</h3>
      {appList.length === 0 ? (
        <p className="text-gray-500 text-sm">No applicants yet.</p>
      ) : (
        appList.map((app) => (
          <div key={app.id} className="flex justify-between items-center border rounded-xl p-4 shadow-sm bg-white">
            <div className="flex items-center gap-4">
              <img src={app.freelancer.profilePic || "/default-avatar.png"} alt={app.freelancer.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-medium">{app.freelancer.name}</p>
                <p className="text-sm text-gray-500">
                  Status: <span className={`font-semibold ${app.status === "approved" ? "text-green-600" : app.status === "rejected" ? "text-red-500" : "text-yellow-500"}`}>{app.status}</span>
                </p>
              </div>
            </div>

            {jobStatus === "OPEN" && (
              <div className="flex gap-2">
                <button
                  disabled={loadingId === app.id || app.status === "approved" || app.status === "rejected"}
                  onClick={() => handleStatusUpdate(app.id, "approved")}
                  className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${app.status === "approved" ? "bg-green-600" : "bg-green-500 hover:bg-green-600"} disabled:opacity-50`}
                >
                  {loadingId === app.id ? "..." : "Approve"}
                </button>

                <button
                  disabled={loadingId === app.id || app.status === "rejected"}
                  onClick={() => handleStatusUpdate(app.id, "rejected")}
                  className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${app.status === "rejected" ? "bg-red-600" : "bg-red-500 hover:bg-red-600"} disabled:opacity-50`}
                >
                  {loadingId === app.id ? "..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
