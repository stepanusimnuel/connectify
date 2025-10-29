"use client";

import React from "react";
import Image from "next/image";

interface ServiceItem {
  name: string;
  image: string;
}

interface PopularServiceProps {
  title: string;
  services: ServiceItem[];
}

const PopularService: React.FC<PopularServiceProps> = ({ title, services }) => {
  return (
    <section id="services" className="flex flex-col items-center justify-center text-center py-20 ">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#01367B] mb-12">{title}</h2>

      {/* Services Grid */}
      <div className="flex flex-wrap justify-center gap-8 w-[90%]">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center justify-between bg-[#01367B]  shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-[30%]">
            <h3 className="text-lg font-normal text-white py-6">{service.name}</h3>

            <div className="w-full">
              <Image src={service.image} alt={service.name} width={300} height={200} className="w-full p-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularService;
