"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean; // true jika hanya boleh diakses saat login
  blockIfAuth?: boolean; // true jika hanya boleh diakses saat belum login
}

export default function RouteGuard({ children, requireAuth = false, blockIfAuth = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (requireAuth && !token) {
      router.replace("/auth"); // belum login, redirect ke login
      return;
    }

    if (blockIfAuth && token) {
      // sudah login, redirect sesuai role
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
      }
      return;
    }

    setLoading(false);
  }, [requireAuth, blockIfAuth, router]);

  if (loading) {
    return <div>loading...</div>;
  }

  return <>{children}</>;
}
