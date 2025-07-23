// components/ImportForm.tsx
"use client";

import { useState } from "react";
import { ImportData } from "../page";

interface ImportFormProps {
  onImport: (data: ImportData) => void;
}

export default function ImportForm({ onImport }: ImportFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx"].includes(fileExtension || "")) {
      setError("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value as "users" | "products";
    onImport({ type, file: selectedFile });
    setError(null); // Clear error on successful submission
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!["csv", "xlsx"].includes(fileExtension || "")) {
        setError("Please upload a CSV or Excel (.xlsx) file.");
        setSelectedFile(null);
      } else {
        setError(null);
        setSelectedFile(file);
      }
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Type</label>
        <select
          name="type"
          defaultValue="users"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500"
        >
          <option value="users">Users</option>
          <option value="products">Products</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          name="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {error ? (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </p>
        )}
      </div>
      <button
        type="submit"
        className={`btn-primary w-full ${!selectedFile ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!selectedFile}
      >
        Import
      </button>
    </form>
  );
}