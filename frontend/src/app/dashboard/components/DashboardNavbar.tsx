"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Check } from "lucide-react";
import Link from "next/link";
import ConnectifyText from "../../../components/ConnectifyText";
import Image from "next/image";

interface DashboardNavbarProps {
  role: "FREELANCER" | "COMPANY";
  active: string;
}

export default function DashboardNavbar({ role, active }: DashboardNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // animasi
  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [menuOpen]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", key: "dashboard" },
    { label: "My Profile", href: "/dashboard/profile", key: "my-profile" },
    role === "COMPANY" ? { label: "My Projects", href: "/dashboard/company/projects", key: "my-projects" } : { label: "My Projects", href: "/dashboard/freelancer/projects", key: "my-projects" },
    { label: "Browse Jobs", href: "/dashboard/browse-jobs", key: "browse-jobs" },
    { label: "Browse Freelancers", href: "/dashboard/browse-freelancers", key: "browse-freelancers" },
    { label: "My Payments", href: role === "COMPANY" ? "/dashboard/company/payments" : "/dashboard/freelancer/payments", key: "my-payments" },
    { label: "Terms of Service", href: "/dashboard/terms", key: "terms" },
  ].filter(Boolean);

  return (
    <nav className="relative flex justify-between items-center px-6 py-4 bg-white border-b-slate-100 border-b">
      <div className="flex items-center">
        <Image src="/logo.png" width={100} height={100} alt="Conenctify Logo" />
        <ConnectifyText className="text-2xl font-bold" />
      </div>

      <div ref={dropdownRef} className="relative pe-8">
        <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <MoreHorizontal className="w-6 h-6" />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className={`absolute text-sm -right-6 top-18 w-56 md:w-80 bg-white border border-gray-200 shadow-sm z-50 transform transition-all duration-100 ease-out ${show ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}>
            <ul className="divide-y divide-gray-100">
              {navItems.map((item: any) => {
                const isActive = active === item.key;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setMenuOpen(false);
                        setShow(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${isActive ? "text-blue-600 font-medium" : "text-gray-700"}`}
                    >
                      {/* Kotak checkbox */}
                      <span className={`flex items-center justify-center w-5 h-5 border ${isActive ? "border-[#125B48] bg-[#125B48]" : "border-gray-300 bg-white"}`}>{isActive && <Check className="w-4 h-4 text-white" />}</span>

                      {/* Label teks */}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
