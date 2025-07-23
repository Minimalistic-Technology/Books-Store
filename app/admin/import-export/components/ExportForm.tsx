// components/ExportForm.tsx
"use client";

import { useState } from "react";
import { ExportData } from "../page";
import * as XLSX from "xlsx"; // Add to package.json: npm install xlsx

interface ExportFormProps {
  onExport: (data: ExportData) => void;
}

export default function ExportForm({ onExport }: ExportFormProps) {
  const [exportData, setExportData] = useState<ExportData>({ type: "users", format: "csv" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value as "users" | "products";
    const format = (form.elements.namedItem("format") as HTMLSelectElement).value as "csv" | "excel";

    // Mock data (replace with actual data from your backend)
    let exportDataArray: any[] = [];
    if (type === "users") {
      exportDataArray = [{ username: "user1" }, { username: "user2" }]; // Only username field
    } else if (type === "products") {
      exportDataArray = [
        { name: "Book1", price: 10, stock: 100 },
        { name: "Book2", price: 15, stock: 50 },
      ]; // Suggested fields
    }

    if (exportDataArray.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(exportDataArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = `export_${type}.${format}`;
      if (format === "csv") {
        XLSX.writeFile(workbook, fileName, { bookType: "csv" });
      } else if (format === "excel") {
        XLSX.writeFile(workbook, fileName, { bookType: "xlsx", bookSST: true });
      }
      onExport({ type, format });
      setError(null);
    } else {
      setError("No data available for export.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Type</label>
        <select
          name="type"
          value={exportData.type}
          onChange={(e) => setExportData({ ...exportData, type: e.target.value as "users" | "products" })}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500"
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
          onChange={(e) => setExportData({ ...exportData, format: e.target.value as "csv" | "excel" })}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500"
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
        </select>
      </div>
      <button
        type="submit"
        className={`btn-primary w-full ${error ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!!error}
      >
        Export
      </button>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </form>
  );
}