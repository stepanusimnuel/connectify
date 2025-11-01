"use client";
import React, { useState } from "react";
import SubmitButton from "@/components/SubmitButton";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  password: string;
  description?: string;
  location?: string;
  priceStart?: number;
  profilePic?: string;
  rating?: number;
  specialty?: string;
  totalJobs?: number;
}

interface Props {
  initialData: UserProfile;
}

export default function ProfileForm({ initialData }: Props) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    description: initialData.description || "",
    location: initialData.location || "",
    priceStart: initialData.priceStart || 0,
    specialty: initialData.specialty || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // === Validasi password ===
    if (formData.oldPassword) {
      if (!formData.newPassword || !formData.confirmPassword) {
        alert("Please fill in new password and confirm password.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_2fr] gap-8 items-start">
      {/* === KIRI === */}
      <div className="flex flex-col gap-6">
        {/* Foto + Info */}
        <div className="flex flex-col items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">{initialData.profilePic ? <img src={initialData.profilePic} alt="Profile" className="w-full h-full object-cover" /> : null}</div>

          <p className="text-gray-500 font-medium">{initialData.email}</p>
        </div>

        {/* Info tambahan */}
        <div className="bg-gray-50 rounded-xl px-12 shadow-sm space-y-2 pb-18 pt-12">
          <p className="text-lg font-semibold">Information</p>
          <p>
            <span className="font-semibold">Name:</span> {initialData.name}
          </p>
          <p>
            <span className="font-semibold">Specialty:</span> {initialData.specialty}
          </p>
          <p>
            <span className="font-semibold">Jobs Taken:</span> {initialData.totalJobs || 0}
          </p>
          <p>
            <span className="font-semibold">Rating:</span> {initialData.rating || 0}
          </p>
          <p>
            <span className="font-semibold">Join At:</span> {new Date(initialData.createdAt).toLocaleDateString()}
          </p>
          <button
            type="button"
            className="font-medium text-center px-14 py-2 mt-12 bg-[#FF4E37] rounded-xl text-white mx-auto block"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/auth/login";
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* === KANAN === */}
      <div className="flex flex-col gap-3 px-8 py-10 shadow-sm rounded-lg">
        <h2 className="font-bold text-lg mb-4">User Settings</h2>

        {/* === Bagian Detail === */}
        <h3 className="font-semibold">Details</h3>
        <div className="flex gap-8">
          <div className="w-1/2">
            <label className="flex flex-col">
              Name
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
          <div className="w-1/2">
            <label className="flex flex-col">
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-1/2">
            <label className="flex flex-col">
              Location
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
          <div className="w-1/2">
            <label className="flex flex-col">
              Specialty
              <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
        </div>

        {/* === Description (Full Width / 2 kolom) === */}
        <div className="mt-3">
          <label className="flex flex-col">
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
          </label>
        </div>

        {/* === Price Start === */}
        <div className="flex gap-8 mt-3">
          <div className="w-1/2">
            <label className="flex flex-col">
              Price Start
              <input type="number" name="priceStart" value={formData.priceStart} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
          <div className="w-1/2"></div>
        </div>

        {/* === Password Section === */}
        <h3 className="font-semibold mt-6">Change Password</h3>
        <div className="flex gap-8">
          <div className="w-1/3">
            <label className="flex flex-col">
              Old Password
              <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
          <div className="w-1/3">
            <label className="flex flex-col">
              New Password
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
          <div className="w-1/3">
            <label className="flex flex-col">
              Confirm Password
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="px-6 py-3 bg-[#B7B7B7]/32 rounded-xl" />
            </label>
          </div>
        </div>

        {/* === Submit === */}
        <div className="mt-6 w-1/4 rounded-2xl overflow-hidden">
          <SubmitButton variant="blue" disabled={loading} text={loading ? "Updating..." : "Save Changes"} />
        </div>
      </div>
    </form>
  );
}
