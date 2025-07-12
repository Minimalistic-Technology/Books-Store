// components/ExportForm.tsx
"use client";

import { useState, useEffect } from "react";

export interface User {
  username: string;
  email: string;
}

type ExportFormProps = {
  onExport: (data: { type: "users" | "products"; format: "csv" | "excel" }) => void;
};

export default function ExportForm({ onExport }: ExportFormProps) {
  const [exportData, setExportData] = useState<{ type: "users" | "products"; format: "csv" | "excel" }>({ type: "users", format: "csv" });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExportData((prev) => {
      if (name === "type") {
        return { ...prev, [name]: value as "users" | "products" };
      } else if (name === "format") {
        return { ...prev, [name]: value as "csv" | "excel" };
      }
      return prev;
    });
  };

  const handleExport = () => {
    onExport(exportData);
    if (exportData.type === "users" && users.length > 0) {
      let exportContent = "";

      if (exportData.format === "csv") {
        // CSV format
        const headers = ["Username", "Email"];
        exportContent = [
          headers.join(","),
          ...users.map((user) =>
            [
              `"${user.username}"`,
              `"${user.email}"`,
            ].join(",")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.csv`);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else if (exportData.format === "excel") {
        // Simple Excel (TSV) format as a basic approximation
        const headers = ["Username", "Email"];
        exportContent = [
          headers.join("\t"),
          ...users.map((user) =>
            [
              user.username,
              user.email,
            ].join("\t")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/tab-separated-values;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.xls`);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Type</label>
        <select
          name="type"
          value={exportData.type}
          onChange={handleChange}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="users">Users</option>
          <option value="products">Products</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Format</label>
        <select
          name="format"
          value={exportData.format}
          onChange={handleChange}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
        </select>
      </div>
      <button
        onClick={handleExport}
        disabled={loading || (exportData.type === "users" && users.length === 0)}
        className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Export Data"}
      </button>
    </div>
  );
}