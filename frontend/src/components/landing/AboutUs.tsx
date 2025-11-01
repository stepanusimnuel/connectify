"use client";

import React from "react";
import Image from "next/image";
import ConnectifyText from "../ConnectifyText";

interface AboutUsProps {
  title: string;
  image: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ title, image }) => {
  return (
    <section id="about" className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-18 py-22 gap-10 bg-linear-to-b from-[#01367B] to-[#0263E1] text-white">
      {/* Left Section - Text */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        <div className="flex flex-col items-start gap-3">
          {/* Logo + Text */}
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="Connectify Logo" width={90} height={90} className="object-contain -mt-1 -me-4" />
            <ConnectifyText className="text-4xl font-semibold text-white" />
          </div>
        </div>
        <div className="w-[90%]">
          <div className="w-full h-0.5 bg-white rounded-full mt-2 mb-8"></div>

          <p className="font-medium md:text-lg leading-relaxed mb-4">
            We connect businesses and individuals with talented freelancers from around the world. Our platform makes it simple to find the right professional for any project—whether it’s design, writing, programming, marketing, or beyond.
          </p>
          <p className="font-medium md:text-lg leading-relaxed">
            With a focus on trust, transparency, and quality, we provide a secure space where clients can hire with confidence and freelancers can showcase their skills. From short-term tasks to long-term collaborations, we make working
            together easier, faster, and more reliable.
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-[90%] h-[300px] md:h-[400px]">
          <Image src={image} alt={title} fill className="object-cover shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
