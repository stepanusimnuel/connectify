"use client";

import React, { useState } from "react";
import { faqData } from "@/data/faq";

interface FAQProps {
  title: string;
  subtitle: string;
}

const FAQ: React.FC<FAQProps> = ({ title, subtitle }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full px-8 md:px-16 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* LEFT COLUMN */}
      <div>
        <h2 className="text-3xl font-semibold text-[#01367B] mb-2">{title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-2 flex flex-col ">
        {faqData.map((faq, index) => (
          <div key={faq.id} className="transition-all border-b-2 border-b-[#ECECF1] py-3">
            {/* Header pertanyaan */}
            <div className="flex justify-between items-center  p-4 " onClick={() => toggleFAQ(faq.id)}>
              <div className="flex gap-4 items-start">
                <span className="text-[#01367B] font-semibold">{index + 1}.</span>
                <h3 className="font-medium text-gray-800">{faq.question}</h3>
              </div>
              <button className="text-black/50 text-2xl w-6 h-6 flex  cursor-pointer items-center justify-center hover:text-black/40">{openId === faq.id ? "×" : "+"}</button>
            </div>

            {/* Isi jawaban */}
            <div className={`px-10 text-xs font-medium text-gray-600 transition-all duration-300 ease-in-out ${openId === faq.id ? "max-h-40 py-2 opacity-100" : "max-h-0 opacity-0 py-0 overflow-hidden"}`}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
