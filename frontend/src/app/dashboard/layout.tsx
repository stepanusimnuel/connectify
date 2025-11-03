"use client";

import { ReactNode, useEffect, useState } from "react";
import DashboardNavbar from "@/app/dashboard/components/DashboardNavbar";
import RouteGuard from "../middleware/routeGuard";
import { AuthProvider } from "../context/AuthContext";

type Role = "COMPANY" | "FREELANCER";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user?.role) setRole(user.role.toUpperCase());
  }, []);

  return (
    <AuthProvider>
      <RouteGuard requireAuth>
        <div className="min-h-screen  bg-[#B0CFF5]/10">
          <DashboardNavbar role={role || "COMPANY"} />
          <main className="max-w-7xl mx-auto px-6 py-6 ">{children}</main>
        </div>
      </RouteGuard>
    </AuthProvider>
  );
}
