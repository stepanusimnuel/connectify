"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

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
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/image-preview-default.png");

  const [form, setForm] = useState({
    title: "",
    description: "",
    specialty: "",
    minSalary: "",
    maxSalary: "",
    location: "Online",
    applicationDeadline: "",
    contractDeadline: "",
    image: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id]);

  async function fetchJob() {
    try {
      const res = await fetch(`${API_BASE}/api/projects/company/job/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch job");
      setJob(data);

      setForm({
        title: data.title,
        description: data.description,
        specialty: data.specialty,
        minSalary: data.minSalary.toString(),
        maxSalary: data.maxSalary.toString(),
        location: data.location || "Online",
        applicationDeadline: data.applicationDeadline.split("T")[0],
        contractDeadline: data.contractDeadline.split("T")[0],
        image: data.image || "",
      });

      setPreview(data.image ? (data.image.startsWith("http") ? data.image : `${API_BASE}/uploads/${data.image}`) : "/image-preview-default.png");
    } catch (err) {
      console.error(err);
      setMessage("Failed to load job data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job || !user) return;

    setLoading(true);
    setMessage("");

    try {
      let imageUrl = form.image;

      // 🔹 Upload ke Cloudinary jika user ganti gambar
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch(`${API_BASE}/api/uploads`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          imageUrl = uploadData.url;
        }
      }

      const body = {
        title: form.title,
        description: form.description,
        specialty: form.specialty,
        minSalary: Number(form.minSalary),
        maxSalary: Number(form.maxSalary),
        image: imageUrl,
        location: form.location,
        applicationDeadline: form.applicationDeadline,
        contractDeadline: form.contractDeadline,
      };

      const res = await fetch(`${API_BASE}/api/projects/company/job/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Job updated successfully!");
        setTimeout(() => {
          router.push(`/dashboard/company/my-projects/${job.id}`);
        }, 1200);
      } else {
        setMessage(data.message || "Failed to update job.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error while updating job.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) return <p className="p-8">Loading...</p>;
  if (!job) return <p className="p-8 text-red-500">Job not found.</p>;
  if (job.status !== "OPEN") {
    return (
      <div className="p-8 text-gray-700">
        ❌ This job can no longer be edited because it is <b>{job.status}</b>.
      </div>
    );
  }

  return (
    <div className="mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-semibold text-[#303030]">Edit Job</h1>
      <p className="text-sm text-[#5E6670] mb-6">Update your job details</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-medium mb-2">Specialty</label>
          <input type="text" name="specialty" value={form.specialty} onChange={handleChange} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <select name="location" value={form.location} onChange={handleChange} className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white">
            <option>Online</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Semarang</option>
            <option>Yogyakarta</option>
            <option>Malang</option>
          </select>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Min Salary</label>
            <input type="number" name="minSalary" value={form.minSalary} onChange={handleChange} min={0} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Salary</label>
            <input type="number" name="maxSalary" value={form.maxSalary} onChange={handleChange} min={0} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
          </div>
        </div>

        {/* Deadlines */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Application Deadline</label>
            <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contract Deadline</label>
            <input type="date" name="contractDeadline" value={form.contractDeadline} onChange={handleChange} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
          </div>
        </div>

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-l-md file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-50"
          />
          <div className="w-full mt-6 min-h-64 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full mt-10 py-4 bg-[#1F76E4] text-[#F4ECE9] text-sm font-semibold rounded-lg hover:bg-[#1F76E4]/90">
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
      </form>
    </div>
  );
}
