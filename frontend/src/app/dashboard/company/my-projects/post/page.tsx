"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function PostProjectPage() {
  const { user } = useAuth();
  const companyId = user?.id;

  const [type, setType] = useState<"JOB" | "COURSE">("JOB");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [location, setLocation] = useState("Online");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [contractDeadline, setContractDeadline] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      alert("You must be logged in as a company to post a project.");
      return;
    }

    const imageUrl = imageFile ? `/uploads/${imageFile.name}` : "/image-preview-default.png";

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);

    const payload =
      type === "JOB"
        ? {
            title,
            description,
            specialty,
            minSalary,
            maxSalary,
            paymentAmount,
            image: imageUrl,
            location,
            applicationDeadline,
            contractDeadline,
            type,
            companyId,
          }
        : {
            title,
            description,
            specialty,
            paymentAmount,
            image: imageUrl,
            location,
            type,
            companyId,
            contractDeadline: oneYearLater,
          };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`${type} created successfully!`);
      } else {
        setMessage(data.message || "Failed to create project.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error while creating project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-semibold text-[#303030]">Post a {type}</h1>
      <p className="text-sm text-[#5E6670] mb-6">Find the best talent for your company</p>

      {/* Toggle Job / Course */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex space-x-4">
          <button type="button" className={`px-4 py-2 rounded-lg border ${type === "JOB" ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`} onClick={() => setType("JOB")}>
            Job
          </button>

          <button type="button" className={`px-4 py-2 rounded-lg border ${type === "COURSE" ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`} onClick={() => setType("COURSE")}>
            Course
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white"></textarea>
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-medium mb-2">Specialty</label>
          <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white">
            <option>Online</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Semarang</option>
            <option>Yogyakarta</option>
            <option>Malang</option>
          </select>
        </div>

        {/* Salary / Payment */}
        {type === "JOB" ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Min Salary</label>
              <input type="number" value={minSalary} min={0} onChange={(e) => setMinSalary(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Salary</label>
              <input type="number" value={maxSalary} min={0} onChange={(e) => setMaxSalary(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Course Price</label>
            <input type="number" value={paymentAmount} min={0} onChange={(e) => setPaymentAmount(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
          </div>
        )}

        {/* Deadlines (Only for JOB) */}
        {type === "JOB" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline</label>
              <input type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contract Deadline</label>
              <input type="date" value={contractDeadline} onChange={(e) => setContractDeadline(e.target.value)} required className="w-full px-7 py-5 border border-[#E7E7F1]/30 rounded-md text-[#121224] bg-white" />
            </div>
          </div>
        )}

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
          <div className="flex items-center space-x-4">
            <div>
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
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-l-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-200 file:text-blue-700
                           hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-2">JPG, PNG, or JPEG up to 10MB</p>
            </div>
          </div>
          <div className="w-full mt-6 min-h-64 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
            <img src={preview || "/image-preview-default.png"} alt="Preview" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full mt-10 py-4 bg-[#1F76E4] text-[#F4ECE9] text-sm font-semibold rounded-lg hover:bg-[#1F76E4]/90">
          {loading ? "Posting..." : `Post ${type}`}
        </button>

        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
      </form>
    </div>
  );
}
