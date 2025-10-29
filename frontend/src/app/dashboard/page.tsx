"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // Cek apakah user sudah login (ada di localStorage)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/auth/login");
    }
  }, [router]);

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-lg w-full bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold text-[#1F76E4] mb-4">Welcome, {user?.name || "User"} 👋</h1>
        <p className="text-gray-600 mb-6">
          You are now logged in as <b>{user?.role || "guest"}</b>.
        </p>

        <button onClick={handleLogout} className="px-5 py-2 bg-[#1F76E4] text-white rounded-lg hover:bg-[#155bb5]">
          Logout
        </button>
      </div>
    </div>
  );
}
