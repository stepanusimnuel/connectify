"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import JobDetailCard from "@/app/dashboard/components/JobDetailCard";
import ApplicationList from "@/app/dashboard/components/ApplicationList";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function BrowseJobDetailPage() {
  const params = useParams();
  const jobId = params?.id ? parseInt(params.id as string) : null;
  const router = useRouter();
  const { user, token } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [unapplying, setUnapplying] = useState(false);

  // Fetch job data
  useEffect(() => {
    if (!jobId) return;

    (async () => {
      try {
        let jobData: any;

        if (user?.role === "COMPANY") {
          // Jika company, ambil detail job company
          const res = await fetch(`${API_BASE}/api/projects/company/job/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          jobData = await res.json();
          setJob(jobData);
        } else if (user?.role === "FREELANCER") {
          // Jika freelancer, cek apakah sudah apply
          const res = await fetch(`${API_BASE}/api/projects/freelancer/job/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setApplication(data); // sudah apply
            setJob(data.job);
          } else if (res.status === 404) {
            // belum apply → ambil job detail biasa
            const jobRes = await fetch(`${API_BASE}/api/projects/company/job/${jobId}`);
            const jobOnly = await jobRes.json();
            setJob(jobOnly);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, user, token]);

  // // Handle company actions
  // const updateStatus = async (newStatus: string, extraData: any = {}) => {
  //   setUpdating(true);
  //   try {
  //     const res = await fetch(`${API_BASE}/api/projects/company/job/${jobId}/status`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus, ...extraData }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);
  //     setJob(data.job);
  //     alert(data.message);
  //   } catch (err: any) {
  //     alert(err.message);
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  const updateStatus = async (newStatus: "ONGOING" | "COMPLETED") => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/company/job/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setJob(data.job); // update state job
      alert(data.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Handle freelancer unapply
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
  if (!job) return <p className="text-center mt-10">Job not found.</p>;

  // Tentukan context dan props JobDetailCard
  let context: "company" | "freelancer" = user?.role === "COMPANY" ? "company" : "freelancer";
  const isOwner = user?.role === "COMPANY" && job.company?.id === user.id;
  const alreadyApplied = user?.role === "FREELANCER" && application;

  return (
    <div className="p-6 space-y-8">
      <JobDetailCard
        job={job}
        context={context}
        applicationStatus={alreadyApplied ? application.status : undefined}
        onUnapply={alreadyApplied ? handleUnapply : undefined}
        onEdit={isOwner ? () => router.push(`/dashboard/company/my-projects/${job.id}/edit`) : undefined}
        onDelete={
          isOwner
            ? async () => {
                if (!confirm("Are you sure?")) return;
                await fetch(`${API_BASE}/api/projects/company/job/${job.id}`, { method: "DELETE" });
                alert("Job deleted.");
                router.push("/dashboard/company/my-projects");
              }
            : undefined
        }
        onStart={isOwner ? () => updateStatus("ONGOING") : undefined}
        onComplete={isOwner ? () => updateStatus("COMPLETED") : undefined}
        loading={updating || unapplying}
      />

      {/* Tampilkan application list hanya jika company dan job miliknya */}
      {isOwner && job.applications && (
        <div className="bg-gray-50 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Applicants</h2>
          <ApplicationList applications={job.applications} jobStatus={job.status} />
        </div>
      )}
    </div>
  );
}
