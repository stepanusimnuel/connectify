"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import JobDetailCard from "@/app/dashboard/components/JobDetailCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function FreelancerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id ? parseInt(params.id as string) : null;
  const { token } = useAuth();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unapplying, setUnapplying] = useState(false);

  // Fetch application (job + status)
  useEffect(() => {
    if (!jobId || !token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects/freelancer/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch application");
        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, token]);

  // Handle unapply
  const handleUnapply = async () => {
    if (!confirm("Are you sure you want to unapply from this job?")) return;
    setUnapplying(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/freelancer/job/${jobId}/unapply`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      router.push("/dashboard/freelancer/my-projects");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUnapplying(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!application) return <p className="text-center mt-10">No application found for this job.</p>;

  return (
    <div className="p-6 space-y-8">
      <JobDetailCard job={application.job} context="freelancer" applicationStatus={application.status} onUnapply={handleUnapply} loading={unapplying} />
    </div>
  );
}
