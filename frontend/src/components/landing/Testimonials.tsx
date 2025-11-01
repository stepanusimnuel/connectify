"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { dummyReviews } from "@/data/testimonial";

interface ReviewsProps {
  title: string;
  subtitle: string;
}

const Reviews: React.FC<ReviewsProps> = ({ title, subtitle }) => {
  const [current, setCurrent] = useState(0);
  const reviews = dummyReviews;
  const review = reviews[current];

  return (
    <section className="w-full flex flex-col md:flex-row items-start justify-between px-8 md:px-18 py-15 gap-24 bg-[#1F76E4] text-white">
      {/* Left Column */}
      <div className="w-full md:w-1/4 flex flex-col justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold  mb-3">{title}</h2>
          <p className="text-sm text-white/65">{subtitle}</p>
        </div>

        {/* Carousel Dots */}
        <div className="flex gap-3 mt-6 md:mt-10">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-4 h-4 rounded-full border-2 border-[#01367B] transition-all duration-300 ${i === current ? "bg-[#01367B]" : "bg-transparent hover:bg-[#B0CFF5]"}`} />
          ))}
        </div>
      </div>

      {/* Right Column - Review */}
      <div className="w-full md:w-3/4 rounded-2xl  flex flex-col md:flex-row gap-6 ">
        {/* Review Content */}
        <div className="flex flex-col grow justify-between">
          <p className="text-xl leading-relaxed italic mb-8">“{review.comment}”</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                <Image src={review.image} alt={review.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-medium ">{review.name}</h3>
                <p className="text-xs font-light mt-1">{review.specialty}</p>
                <p className="text-xs font-light mt-0.5">{review.date}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 self-end">
              <div className="relative flex">
                {Array.from({ length: 5 }).map((_, i) => {
                  const full = i + 1 <= Math.floor(review.rating);
                  const partial = i < review.rating && i + 1 > review.rating;

                  return (
                    <div key={i} className="relative w-10 h-10">
                      {/* Outline Star */}
                      <Star size={40} className="absolute fill-gray-300" />

                      {/* Filled Part */}
                      {(full || partial) && (
                        <Star
                          size={40}
                          className="absolute fill-[#FFD700]"
                          style={{
                            clipPath: partial ? `inset(0 ${(1 - (review.rating % 1)) * 100}% 0 0)` : "none",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="ml-1 text-2xl font-bold text-white">{review.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
