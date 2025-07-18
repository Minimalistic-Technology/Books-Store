"use client";

import { useState } from "react";
import { ImportData } from "../page";
import type { Product } from "../../order-product-management/types";
import { User } from "./ExportForm";

interface ImportFormProps {
  onImport: (data: { type: "users" | "products"; file: File | null; parsedData: User[] | Product[] | null }) => void;
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
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      let parsedData: User[] | Product[] | null = null;

      try {
        const lines = text.split("\n").filter(line => line.trim());
        const headers = lines[0].split(/[,|\t]/).map(header => header.trim().toLowerCase());
        const dataLines = lines.slice(1);

        if (type === "users") {
          if (!headers.includes("username") || !headers.includes("email")) {
            throw new Error("CSV must contain 'Username' and 'Email' columns.");
          }
          parsedData = dataLines.map(line => {
            const values = line.split(/[,|\t]/).map(value => value.trim().replace(/^"|"$/g, ''));
            return {
              username: values[headers.indexOf("username")],
              email: values[headers.indexOf("email")],
            };
          }).filter(user => user.username && user.email);
        } else if (type === "products") {
          if (!headers.includes("product name") || !headers.includes("price") || !headers.includes("inventory (quantity)") || !headers.includes("description")) {
            throw new Error("CSV must contain 'Product Name', 'Price', 'Inventory (Quantity)', and 'Description' columns.");
          }
          parsedData = dataLines.map(line => {
            const values = line.split(/[,|\t]/).map(value => value.trim().replace(/^"|"$/g, ''));
            return {
              id: "",
              name: values[headers.indexOf("product name")],
              price: parseFloat(values[headers.indexOf("price")]) || 0,
              inventory: parseInt(values[headers.indexOf("inventory (quantity)")], 10) || 0,
              description: values[headers.indexOf("description")],
              createdAt: new Date().toISOString(),
            };
          }).filter(product => product.name && product.price >= 0 && product.inventory >= 0 && product.description);
        }

        if (!parsedData || parsedData.length === 0) {
          throw new Error("No valid data found in the file.");
        }

        onImport({ type, file: selectedFile, parsedData });
        setError(null);
      } catch (err) {
        setError((err as Error).message || "Failed to parse file.");
      }
    };

    reader.readAsText(selectedFile);
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