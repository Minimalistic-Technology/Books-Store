"use client";

import { useState } from "react";
import type { ExportData } from "../page";

type ExportFormProps = {
  onExport: (data: ExportData) => void;
};

export default function ExportForm({ onExport }: ExportFormProps) {
  const [formData, setFormData] = useState<ExportData>({ type: "users", format: "csv" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onExport(formData);
  };

  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "users" | "products" })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="users">Users</option>
            <option value="products">Products</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Format</label>
          <select
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value as "csv" | "excel" })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export
        </button>
      </form>
    </div>
  );
}