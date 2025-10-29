"use client";

import React from "react";
import Image from "next/image";
import ConnectifyText from "./ConnectifyText";
import NavLinks from "./NavLinks";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed z-100 w-full bg-white shadow-sm px-8 pe-12 py-4 flex items-center justify-between overflow-x-hidden">
      {/* Left Section: Navigation Links */}
      <NavLinks />

      {/* Right Section: Logo */}
      <div className="flex items-center gap-2">
        <ConnectifyText className="text-lg font-bold" />
        <Image src="/logo.png" alt="Connectify Logo" width={80} height={80} className="object-contain -mt-1 -me-4 scale-125" />
      </div>
    </nav>
  );
};

export default Navbar;
