"use client";

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  role: "User" | "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip authentication check for /admin/login
    if (pathname === "/admin/login") {
      setIsLoading(false);
      setIsAuthenticated(true); // Allow login page to render
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push("/admin/login");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.role !== "Admin") {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null; // Prevent rendering until redirect completes for protected routes
  }

  return (
    <div className="page-container flex flex-row h-screen bg-yellow-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 overflow-auto">
        <main className="flex-1 p-6 overflow-auto w-full animate__fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}