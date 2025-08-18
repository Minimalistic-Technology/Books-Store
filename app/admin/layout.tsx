"use client";

import Sidebar from "../components/Sidebar";
import { useMemo, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false); 

  return (
      <div className="page-container flex flex-row h-screen bg-yellow-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          <main className="flex-1 p-6 overflow-auto w-full animate__fadeIn">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
  );
}