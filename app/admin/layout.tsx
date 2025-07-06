"use client";

import Sidebar from "../components/Sidebar";
import "../../app/globals.css";
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
    <DashboardContext.Provider value={contextValue}>
      <div className="flex flex-row h-screen w-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 bg-green-100">
          <main className="flex-1 p-6 overflow-auto w-full">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}