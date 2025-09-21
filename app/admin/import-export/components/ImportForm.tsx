

"use client";

import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
// import { User } from "./ExportForm";
import { API_BASE_URL } from "../../../../utils/api";
import { Category, Content, User } from "../../order-product-management/types";

interface ImportFormProps {
  onImport: (
    data:
      | { type: "users"; file: File | null; parsedData: User[] }
      | { type: "products"; file: File | null; parsedData: Content[] }
  ) => void;
}

interface UserRow {
  username: string;
  email: string;
  phone:number;
}

interface ProductRow {
  bookName:string;
  title: string;
  category: string;
  categoryPath: string;
  subcategory: string;
  tags: string;
  author: string;
  publisher: string;
  price: string;
  condition: string;
  "new quantity": string;
  "discount for new books (%)": string;
  "old quantity": string;
  "discount for old books (%)": string;
  "valid image link": string;
  "estimated delivery": string;
  description: string;
  "seo title": string;
  "seo description": string;
}

export default function ImportForm({ onImport }: ImportFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.map((cat: Category) => cat.name));
      } catch  {
        
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv") {
      setError("Only CSV files are supported. Please convert .xlsx to .csv.");
      return;
    }

    const form = e.currentTarget;
    const type = (form.elements.namedItem("type") as HTMLSelectElement)
      .value as "users" | "products";

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      let parsedData: User[] | Content[] = [];

      try {
        const result: ParseResult<UserRow | ProductRow> = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim().toLowerCase(),
          transform: (value: string) => value.trim(),
        });

        if (result.errors.length > 0) {
          throw new Error(
            result.errors
              .map((e) => `Row ${e.row ? e.row + 2 : "unknown"}: ${e.message}`)
              .join("; ")
          );
        }

        const rows = result.data;

        if (type === "users") {
          parsedData = rows
            .map((row) => {
              const u = row as UserRow;
              if (!u.username || !u.email) return null;
              return { username: u.username, email: u.email,phone:u.phone } as User;
            })
            .filter((u): u is User => u !== null);
        } else {
          parsedData = await Promise.all(
            rows.map(async (row) => {
              const p = row as ProductRow;
              if (!categories.includes(p.category)) return null;

              const imageUrl = p["valid image link"];
              const defaultImage =
                "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

              if (
                imageUrl &&
                imageUrl !== defaultImage &&
                !imageUrl.startsWith("https://res.cloudinary.com/")
              ) {
                
                return null;
              }

              if (
                !["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(p.condition)
              ) {
                
                return null;
              }

              return {
                bookName:p.bookName,
                title: p.title,
                categoryName: p.category,
                subCategory: p.subcategory,
                tags: p.tags || "General",
                author: p.author,
                publisher: p.publisher,
                price: parseFloat(p.price) || 0,
                condition: p.condition,
                quantityNew: parseInt(p["new quantity"], 10) || 0,
                discountNew: parseFloat(p["discount for new books (%)"]) || 0,
                quantityOld: parseInt(p["old quantity"], 10) || 0,
                discountOld: parseFloat(p["discount for old books (%)"]) || 0,
                imageUrl: imageUrl || defaultImage,
                estimatedDelivery: p["estimated delivery"],
                description: p.description,
                seoTitle: p["seo title"] || p.title,
                seoDescription: p["seo description"] || p.description,
                categoryPath: `${p.category}/${p.subcategory}`,
              } as Content;
            })
          ).then((list) => list.filter((p): p is Content => p !== null));
        }

        if (!parsedData.length) {
          throw new Error("No valid data found in file.");
        }

        if (type === "users") {
          onImport({
            type: "users",
            file: selectedFile,
            parsedData: parsedData as User[],
          });
        } else {
          onImport({
            type: "products",
            file: selectedFile,
            parsedData: parsedData as Content[],
          });
        }

        setError(null);
      } catch (err) {
        
        setError((err as Error).message);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data Type
        </label>
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
        <label className="block text-sm font-medium text-gray-700">
          Upload File
        </label>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {error ? (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            {selectedFile ? selectedFile.name : "No file selected"}
          </p>
        )}
      </div>
      <button
        type="submit"
        className={`btn-primary w-full ${
          !selectedFile ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedFile}
      >
        Import
      </button>
    </form>
  );
}
