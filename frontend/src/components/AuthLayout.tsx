import Image from "next/image";
import React from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  hero: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, hero, children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 text-white flex-col relative overflow-hidden">
        {/* Background Image */}
        <Image src={hero} alt="Connectify illustration" width={400} height={400} className="absolute inset-0 w-full h-full object-cover z-0" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1C1E53] opacity-60 z-10"></div>

        {/* Text Content */}
        <div className="relative z-20 w-4/7 mt-18 ms-16">
          <h1 className="w-full text-3xl/[160%] tracking-wider font-semibold mb-6">One Step Closer to Hire your Suitable Freelancer!</h1>
          <h3 className="w-full text-sm font-light">A service that help you to easily find suitable freelancer to finish your projects!</h3>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex w-1/2 justify-center items-center bg-[#01367B] text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold tracking-wide mb-4">{title}</h2>
          <h3 className="tex-sm font-light mb-6">{subtitle}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
