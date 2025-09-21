"use client";

import Sidebar from "../components/Sidebar";
import AdminProtected from "./ProtectedWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="page-container flex flex-row h-screen bg-yellow-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          <main className="flex-1 p-6 overflow-auto w-full animate__fadeIn">
            {children}
          </main>
        </div>
      </div>
    </AdminProtected>
  );
}
