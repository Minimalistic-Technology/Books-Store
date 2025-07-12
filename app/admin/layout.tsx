// app/admin/layout.tsx
"use client";

import Sidebar from "../components/Sidebar";
import { DashboardContext, useDashboard } from "../admin/dashboard/page";
import { useMemo } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, handleLogout } = useDashboard();

  const contextValue = useMemo(() => ({ isLoggedIn, handleLogout }), [isLoggedIn, handleLogout]);

  return (
    // <DashboardContext.Provider value={contextValue}>
      <div className="page-container flex flex-row h-screen bg-yellow-50 overflow-auto">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <main className="flex-1 p-6 overflow-auto w-full animate__fadeIn">
            {children}
          </main>
        </div>
      </div>
    // </DashboardContext.Provider>
  );
}