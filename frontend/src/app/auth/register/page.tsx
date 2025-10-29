"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const router = useRouter();

  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role || !["client", "freelancer"].includes(role.toLowerCase())) {
      router.replace("/auth/choose-role");
    }
  }, [role, router]);

  useEffect(() => {
    const { name, email, password } = formData;
    setIsFormValid(!!name && !!email && !!password);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: role?.toUpperCase() === "CLIENT" ? "COMPANY" : "FREELANCER",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/home");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  function capitalize(word: string | null) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <AuthLayout title={`Register As a ${capitalize(role)}`} subtitle="Build your flexible dream team with our global network of experts!!" hero="/hero-register.png">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Your Name" type="input" name="name" value={formData.name} onChange={handleChange} />
        <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />

        <SubmitButton disabled={!isFormValid} text={loading ? "Registering..." : "Register"} />
      </form>

      <p className="text-center text-sm font-light mt-5">
        Already have an Account?{" "}
        <a href="/auth/login" className="underline">
          Login
        </a>
      </p>
    </AuthLayout>
  );
}
