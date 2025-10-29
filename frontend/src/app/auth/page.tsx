"use client";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import ConnectifyText from "@/components/ConnectifyText";

export default function AuthWelcome() {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-center px-6"
      style={{
        background: "linear-gradient(117deg, rgba(0,217,255,0.2) 0%, rgba(130,234,237,0) 51%, rgba(0,51,255,0.16) 100%)",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#1F76E4] mb-2 text-shadow-lg tracking-wider">WELCOME TO CONNECTIFY!</h1>
        <p className="text-lg md:text-xl text-[#1F76E4]/90 font-medium ">Connecting Talent to Opportunity.</p>
      </div>

      {/* Logo */}
      <div className="mb-16 flex flex-col items-center transition-all">
        <Image src="/logo.png" alt="Connectify Logo" width={240} height={240} />
        <ConnectifyText className="text-3xl font-bold" />
      </div>

      {/* Tombol Register */}
      <Link className="w-1/3" href="auth/choose-role">
        <SubmitButton text="Let's Start Our Journey" variant="blue" />
      </Link>

      {/* Link ke Login */}
      <p className="text-[#1F76E4] mt-3 text-sm font-light">
        Already have an Account?{" "}
        <Link className="underline" href="/auth/login">
          Login
        </Link>
      </p>
    </div>
  );
}
