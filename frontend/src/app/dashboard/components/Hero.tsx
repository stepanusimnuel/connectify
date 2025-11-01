"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
  const activeProject = {
    title: "DemiKita App",
    description: "Aplikasi Pemerintah yang scope nya untuk rakyat Indonesia dimana difokuskan kepada penampungan volunteer dan donasi untuk bencana alam di seluruh wilayah Indonesia.",
    image: "/dashboard/hero.png",
  };

  return (
    <section className="bg-[#1F76E4] shadow p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded">
      {/* Left: Text */}
      <div className="space-y-4">
        <p className="mb-1 font-light text-white/65">Your latest ONGOING Project</p>
        <h2 className="text-3xl font-semibold text-white">{activeProject.title}</h2>
        <p className="text-white/65 font-light">{activeProject.description}</p>
        <button className="bg-[#B0CFF5] text-[#13120F] px-6 text-sm font-medium py-3 rounded hover:bg-[#B0CFF5]/90 transition mt-auto">Track Progress</button>
      </div>

      {/* Right: Image */}
      <div className="relative w-full h-56 md:h-72">
        <Image src={activeProject.image} alt="Active Project" fill className="object-cover rounded-2xl" />
      </div>
    </section>
  );
}
