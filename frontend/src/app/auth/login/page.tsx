"use client";
import React, { useState } from "react";
import AuthLayout from "@/app/auth/components/AuthLayout";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isFormValid = formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Quality work done faster Access to talent and businesses across the globe" hero="/hero-login.png">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} className="accent-primary" />
            Remember me
          </label>
          <a href="#" className="text-primary hover:underline">
            Forgot password?
          </a>
        </div>

        <SubmitButton text={loading ? "Logging in..." : "Login"} disabled={!isFormValid} />
      </form>
      <p className="text-center text-sm mt-5">
        Don't Have an Account?{" "}
        <a href="/auth/register" className="underline">
          Register
        </a>
      </p>
    </AuthLayout>
  );
}
