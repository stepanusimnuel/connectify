"use client";

import React from "react";
import Image from "next/image";
import SubmitButton from "./SubmitButton";

interface HeroProps {
  title: string;
  subtitle: string;
  imageSet: string[];
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSet }) => {
  const handleCtaClick = () => {
    window.location.href = "/auth";
  };

  return (
    <section id="home" className="flex mt-20 flex-col md:flex-row items-center justify-between w-full  py-2 bg-white overflow-hidden bg-linear-to-b from-[#01367B] to-[#0263E1] text-white">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-start w-full md:w-4/7 space-y-6 px-14 ">
        <h1 className="text-3xl md:text-5xl font-medium leading-snug">{title}</h1>
        <p className=" text-lg w-19/20">{subtitle}</p>
        <div className="w-48 drop-shadow-sm drop-shadow-black">
          <SubmitButton text="Get Started!" onClick={handleCtaClick} disabled={false} variant="gray_blue" />
        </div>
      </div>

      {/* Right Side */}
      <div className=" flex flex-col items-start md:w-3/7 mt-12 md:mt-0">
        {/* 2 Rows */}
        <div className="flex gap-1 mb-1">
          {imageSet.slice(0, 4).map((src, index) => (
            <div key={index} className=" relative aspect-3/4 h-60">
              <Image src={`/hero-landing/${src}`} alt={`Freelancer ${index + 1}`} fill className=" transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
        </div>

        <div className="flex gap-1  ">
          {imageSet.slice(4, 8).map((src, index) => (
            <div key={index} className="relative aspect-3/4 h-60 ">
              <Image src={`/hero-landing/${src}`} alt={`Freelancer ${index + 5}`} fill className=" transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
