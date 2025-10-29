"use client";

import React from "react";
import Image from "next/image";

const NavLinks: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-center gap-8 w-full">
      <div className="w-full justify-end flex items-center gap-6 font-medium text-gray-700 me-16">
        <button onClick={() => scrollToSection("home")} className="hover:text-blue-600 transition-colors">
          Home
        </button>
        <button onClick={() => scrollToSection("about")} className="hover:text-blue-600 transition-colors">
          About Us
        </button>
        <button onClick={() => scrollToSection("projects")} className="hover:text-blue-600 transition-colors">
          Projects
        </button>
        <button onClick={() => scrollToSection("services")} className="hover:text-blue-600 transition-colors">
          Services
        </button>
        <button onClick={() => scrollToSection("faq")} className="hover:text-blue-600 transition-colors">
          FAQ
        </button>
        <button onClick={() => scrollToSection("blog")} className="hover:text-blue-600 transition-colors">
          Blog
        </button>
      </div>
    </div>
  );
};

export default NavLinks;
