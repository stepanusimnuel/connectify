"use client";
import Image from "next/image";
import React from "react";

interface WorkerCardProps {
  name: string;
  image: string;
  location?: string;
  specialty?: string;
  description?: string;
  priceStart?: number;
  totalJobs?: number;
  rating?: number;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ name, image, location, specialty, description = "", priceStart = 0, totalJobs = 0, rating }) => {
  return (
    <div className="bg-white border border-[#13120F] rounded-2xl p-4 hover:shadow-lg transition w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-[#282938]">{name}</h3>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>

      <p className="text-[#282938] text-xl mt-6 font-medium">{specialty}</p>

      {/* Description */}
      <p className="text-xs/5 text-[#282938]/55 mt-2">{description?.length > 150 ? `${description.slice(0, 150)}...` : description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto text-sm pt-6">
        <div className="flex gap-6">
          <span className="font-light text-black">From IDR.{priceStart ? priceStart.toLocaleString("id-ID") : "0"}</span>
          <span className="font-light text-black">{totalJobs} Job(s)</span>
        </div>
        <div className="text-white text-xs rounded-full py-1 px-3 bg-[#1C1E53]">⭐ &nbsp; {rating}</div>
      </div>
    </div>
  );
};

export default WorkerCard;
