"use client";

import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import ConnectifyText from "./ConnectifyText";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#01367B] text-white px-8 md:px-16 pt-18 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <ConnectifyText className="text-3xl font-semibold text-white" />
          </div>
          <p className="text-sm text-gray-200 max-w-md leading-relaxed">Find your Freelancer with Connectify</p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Sosial Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosial Media</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-200">
              <li>
                <Link href="https://www.instagram.com/connectify.co.id/" className="hover:underline flex items-center gap-2" target="blank">
                  <Instagram className="w-4 h-4" /> Instagram
                </Link>
              </li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-200">
              <li>
                <Link href="#" className="hover:underline">
                  Merdeka Belajar
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Finterpreneur
                </Link>
              </li>
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-200">
              <li>
                <Link href="#" className="hover:underline">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" pt-12 text-center text-sm text-gray-300">© {new Date().getFullYear()} Connectify</div>
    </footer>
  );
};

export default Footer;
