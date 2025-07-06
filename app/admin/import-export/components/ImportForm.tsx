"use client";

import { useState } from "react";
import type { ImportData } from "../page";

type ImportFormProps = {
  onImport: (data: ImportData) => void;
};

export default function ImportForm({ onImport }: ImportFormProps) {
  const [formData, setFormData] = useState<ImportData>({ file: null, type: "users" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onImport(formData);
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
          <label className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          disabled={!formData.file}
        >
          Import
        </button>
      </form>
    </div>
  );
}