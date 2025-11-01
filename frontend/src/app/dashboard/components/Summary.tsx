import React from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
}

export default function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="bg-[#1F76E4] rounded-2xl shadow-md p-5 flex flex-col items-start justify-center">
      <h4 className="text-[#D9D9D9] text-lg font-light mb-2">{title}</h4>
      <p className="text-2xl font-medium text-white mb-2">{value}</p>
      <p className="text-sm font-light text-white">{description}</p>
    </div>
  );
}
