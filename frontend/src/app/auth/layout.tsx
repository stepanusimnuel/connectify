"use client";

import RouteGuard from "@/app/middleware/routeGuard";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard blockIfAuth>
      <main>{children}</main>
    </RouteGuard>
  );
}
