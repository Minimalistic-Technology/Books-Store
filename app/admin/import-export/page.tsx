"use client";

import { useState } from "react";
import ExportForm from "./components/ExportForm";
import ImportForm from "./components/ImportForm";

// Define interfaces
export interface ExportData {
  type: "users" | "products";
  format: "csv" | "excel";
}

export interface ImportData {
  file: File | null;
  type: "users" | "products";
}

export default function ImportExportManagement() {
  const [exportData, setExportData] = useState<ExportData>({ type: "users", format: "csv" });
  const [importData, setImportData] = useState<ImportData>({ file: null, type: "users" });

  const handleExport = (data: ExportData) => {
    setExportData(data);
    console.log("Exporting:", data);
  };

  const handleImport = (data: ImportData) => {
    setImportData(data);
    if (data.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        console.log("Imported data:", text);
      };
      reader.readAsText(data.file);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Import/Export - Books Store</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>
          <ExportForm onExport={handleExport} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Import Bulk Data</h2>
          <ImportForm onImport={handleImport} />
        </div>
      </div>
    </div>
  );
}