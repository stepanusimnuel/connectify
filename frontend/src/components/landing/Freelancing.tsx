"use client";

import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import { hiringCards, workingCards, CardData } from "@/data/freelancing";

const Freelancing: React.FC = () => {
  const [mode, setMode] = useState<"I'm Working" | "I'm Hiring">("I'm Hiring");

  const currentCards: CardData[] = mode === "I'm Hiring" ? hiringCards : workingCards;

  return (
    <section className="w-full px-8 md:px-16 py-20 text-center mb-32">
      {/* Title + Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h2 className="text-3xl font-semibold text-[#01367B]">Freelancing is not a problem!</h2>

        <div className="flex mt-4 md:mt-0 border border-[#01367B] rounded-md overflow-hidden">
          {/* Tombol Working */}
          <button onClick={() => setMode("I'm Working")} className={`px-10 py-3 font-medium transition-all ${mode === "I'm Working" ? "bg-[#B0CFF5] text-[#13120F]" : "bg-white text-[#01367B] hover:bg-gray-100"}`}>
            I’m Working
          </button>

          {/* Tombol Hiring */}
          <button onClick={() => setMode("I'm Hiring")} className={`px-10 py-3 font-medium transition-all ${mode === "I'm Hiring" ? "bg-[#B0CFF5] text-[#13120F]" : "bg-white text-[#01367B] hover:bg-gray-100"}`}>
            I’m Hiring
          </button>
        </div>
      </div>

      {/* Card Section */}
      <div className="flex flex-wrap justify-between gap-8 px-4 md:px-0">
        {currentCards.map((card, index) => (
          <div key={index} className="flex flex-col items-center bg-white hover:scale-105 transition-all w-[90%] sm:w-[45%] md:w-[30%] overflow-hidden ">
            {/* Image */}
            <div className="relative w-full h-48">
              <Image src={card.image} alt={card.title} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="flex flex-col text-left pt-4">
              <h3 className="text-xl font-medium text-[#01367B] mb-2">{card.title}</h3>
              <p className="text-sm font-light text-[#282938] mb-6">{card.subtitle}</p>
              <SubmitButton text={card.buttonText} disabled={false} variant="light_blue" onClick={() => alert(`${card.buttonText} clicked`)} />
            </div>
          </div>
        ))}
      </div>

      {/* Top Companies */}
      <div className="w-[90%] mx-auto">
        <div className="w-full px-6 flex items-center mt-48">
          <div className="grow h-0.5 bg-[#ACB2B9]/45 rounded-full"></div>
          <span className="mx-4 text-[#5E6670] px-2">Top companies hiring now</span>
          <div className="grow h-0.5 bg-[#ACB2B9]/45 rounded-full"></div>
        </div>
        <div className="flex gap-4 w-[90%] mx-auto justify-between items-center mt-8">
          {["1.png", "2.png", "3.png", "4.png", "5.png"].map((img, index) => (
            <div key={index} className="relative w-32 h-14 shrink-0">
              <Image src={`/top-company/${img}`} alt={`Top Company ${index + 1}`} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Freelancing;
