"use client";

import { useState } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const [selectedRole, setSelectedRole] = useState<"CLIENT" | "FREELANCER" | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (!selectedRole) return;
    router.push(`/auth/register?role=${selectedRole.toLowerCase()}`);
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-center px-6"
      style={{
        background: "linear-gradient(117deg, rgba(0,217,255,0.2) 0%, rgba(130,234,237,0) 51%, rgba(0,51,255,0.16) 100%)",
      }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F76E4] text-shadow-lg">Join as a Client or Freelancer</h1>
      </div>

      {/* Role Selection */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Client Box */}
        <div
          onClick={() => setSelectedRole("CLIENT")}
          className={`cursor-pointer border-2 rounded-2xl p-8 w-72 md:w-80 flex flex-col items-center transition-all duration-300 ${
            selectedRole === "CLIENT" ? "border-[#1F76E4] bg-[#1F76E4]/10 scale-105" : "border-gray-300 hover:scale-105"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Image src="/client-icon.png" alt="Client Icon" width={120} height={120} />
          </div>
          <h2 className="text-xl font-semibold text-[#1F76E4] mb-2">I’m a Client</h2>
          <p className="text-gray-600 text-sm">I’m hiring freelancers for a project.</p>
        </div>

        {/* Freelancer Box */}
        <div
          onClick={() => setSelectedRole("FREELANCER")}
          className={`cursor-pointer border-2 rounded-2xl p-8 w-72 md:w-80 flex flex-col items-center transition-all duration-300 ${
            selectedRole === "FREELANCER" ? "border-[#1F76E4] bg-[#1F76E4]/10 scale-105" : "border-gray-300 hover:scale-105"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Image src="/freelancer-icon.png" alt="Freelancer Icon" width={120} height={120} />
          </div>
          <h2 className="text-xl font-semibold text-[#1F76E4] mb-2">I’m a Freelancer</h2>
          <p className="text-gray-600 text-sm">I’m looking for work.</p>
        </div>
      </div>

      {/* Register Button */}
      <div className="w-1/3">
        <SubmitButton text={selectedRole ? "Apply as " + selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase() : "Which One Are You?"} variant="blue" disabled={!selectedRole} onClick={handleSubmit} />
      </div>

      {/* Login Link */}
      <p className="text-[#1F76E4] mt-3 text-sm font-light">
        Already have an Account?{" "}
        <Link className="underline" href="/auth/login">
          Login
        </Link>
      </p>
    </div>
  );
}
