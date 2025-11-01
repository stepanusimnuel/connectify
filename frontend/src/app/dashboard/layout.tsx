"use client";

import { ReactNode, useEffect, useState } from "react";
import DashboardNavbar from "@/app/dashboard/components/DashboardNavbar";
import RouteGuard from "../middleware/routeGuard";

type Role = "COMPANY" | "FREELANCER";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user?.role) setRole(user.role.toUpperCase());
  }, []);

  return (
    <RouteGuard requireAuth>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar role={role || "COMPANY"} active="dashboard" />
        <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
      </div>
    </RouteGuard>
  );
}
