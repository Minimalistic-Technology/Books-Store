"use client";

import { useState, useEffect } from "react";
import { Content } from "../../content-management/page";
import Papa, { ParseResult } from "papaparse";
import { User } from "./ExportForm";

interface ImportFormProps {
  onImport: (
    data:
      | { type: "users"; file: File | null; parsedData: User[] }
      | { type: "products"; file: File | null; parsedData: Content[] }
  ) => void;
}

export default function ImportForm({ onImport }: ImportFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/book-categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.map((cat: any) => cat.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["csv", "xlsx"].includes(fileExtension)) {
      setError("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value as
      | "users"
      | "products";

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      console.log("Raw CSV text:", text);
      let parsedData: User[] | Content[] | null = null;

      try {
        const result: ParseResult<any> = Papa.parse(text, {
          header: true,
          skipEmptyLines: "greedy",
          transformHeader: (header: string) => header.trim().toLowerCase(),
          transform: (value: string) => value.trim(),
          delimiter: ",",
          quoteChar: '"',
          escapeChar: '"',
          dynamicTyping: false,
          complete: (results) => {
            results.data = results.data.filter((row: any) => {
              const fieldCount = Object.keys(row).length;
              if (fieldCount < 17) {
                console.warn(`Skipping row with ${fieldCount} fields:`, row);
                return false;
              }
              return true;
            });
          },
        });

        if (result.errors.length > 0) {
          throw new Error(
            `CSV parsing error: ${result.errors
              .map((e) => `Row ${e.row ? e.row + 2 : "unknown"}: ${e.message}`)
              .join("; ")}`
          );
        }

        const dataLines = result.data as any[];
        if (dataLines.length === 0) {
          throw new Error("CSV file is empty or has no valid data rows.");
        }

        if (type === "users") {
          const requiredHeaders = ["username", "email"];
          if (!requiredHeaders.every((h) => result.meta.fields?.includes(h))) {
            throw new Error("CSV must contain 'username' and 'email' columns.");
          }

          parsedData = dataLines
            .map((row, i) => {
              if (!row.username || !row.email) {
                throw new Error(`Missing username or email at row ${i + 2}`);
              }
              return { username: row.username, email: row.email } as User;
            })
            .filter((user) => user.username && user.email);
        } else if (type === "products") {
          const requiredHeaders = [
            "title",
            "category",
            "subcategory",
            "tags",
            "author",
            "publisher",
            "price",
            "condition",
            "new quantity",
            "discount for new books (%)",
            "old quantity",
            "discount for old books (%)",
            "valid image link",
            "estimated delivery",
            "description",
            "seo title",
            "seo description",
          ];

          if (!requiredHeaders.every((h) => result.meta.fields?.includes(h))) {
            throw new Error(`Missing one or more required columns: ${requiredHeaders.join(", ")}`);
          }

          parsedData = [];
          for (const [index, row] of dataLines.entries()) {
            const category = row.category;
            if (!categories.includes(category)) {
              console.warn(`Skipping row ${index + 2}: Invalid category "${category}"`);
              continue;
            }

            try {
              const tagRes = await fetch(
                `http://localhost:5000/api/book-categories/${encodeURIComponent(category)}/tags`
              );
              if (!tagRes.ok) throw new Error(`Could not fetch tags for ${category}`);
              const tagData = await tagRes.json();
              if (!tagData.tags.includes(row.subcategory)) {
                console.warn(
                  `Skipping row ${index + 2}: Invalid subcategory "${row.subcategory}" for category "${category}"`
                );
                continue;
              }
            } catch (err) {
              console.warn(`Skipping row ${index + 2}: Failed to validate subcategory: ${(err as Error).message}`);
              continue;
            }

            const imageUrl = row["valid image link"];
            const defaultImage = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";
            if (
              imageUrl &&
              imageUrl !== defaultImage &&
              !imageUrl.startsWith("https://res.cloudinary.com/")
            ) {
              console.warn(
                `Skipping row ${index + 2}: Invalid image URL: must be a valid Cloudinary URL or the default image`
              );
              continue;
            }

            const condition = row.condition;
            if (!["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(condition)) {
              console.warn(`Skipping row ${index + 2}: Invalid condition "${row.condition}"`);
              continue;
            }

            const tags = row.tags && row.tags.trim() ? row.tags : "General";

            const requiredFields = {
              title: row.title,
              categoryName: category,
              subCategory: row.subcategory,
              tags: tags,
              author: row.author,
              publisher: row.publisher,
              price: row.price,
              condition: condition,
              imageUrl: imageUrl || defaultImage,
              estimatedDelivery: row["estimated delivery"],
              description: row.description,
            };

            const missingFields = Object.entries(requiredFields)
              .filter(([_, value]) => !value || value === "")
              .map(([key]) => key);

            if (missingFields.length > 0) {
              console.warn(`Skipping row ${index + 2}: Missing required fields: ${missingFields.join(", ")}`);
              continue;
            }

            const product: Content = {
              id: "",
              title: row.title,
              categoryName: category,
              subCategory: row.subcategory,
              tags: tags,
              author: row.author,
              publisher: row.publisher,
              price: parseFloat(row.price) || 0,
              condition: condition,
              quantityNew: parseInt(row["new quantity"], 10) || 0,
              discountNew: parseFloat(row["discount for new books (%)"]) || 0,
              quantityOld: parseInt(row["old quantity"], 10) || 0,
              discountOld: parseFloat(row["discount for old books (%)"]) || 0,
              imageUrl: imageUrl || defaultImage,
              estimatedDelivery: row["estimated delivery"],
              description: row.description,
              seoTitle: row["seo title"] || row.title,
              seoDescription: row["seo description"] || row.description,
            };

            if (product.price <= 0) {
              console.warn(`Skipping row ${index + 2}: Price must be greater than 0`);
              continue;
            }

            parsedData.push(product);
          }
        }

        if (!parsedData || parsedData.length === 0) {
          throw new Error("No valid data found in the file after validation.");
        }

        if (type === "users") {
          onImport({ type: "users", file: selectedFile, parsedData: parsedData as User[] });
        } else {
          onImport({ type: "products", file: selectedFile, parsedData: parsedData as Content[] });
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message || "Failed to parse file.");
        console.error("Parsing error details:", err);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["csv", "xlsx"].includes(fileExtension)) {
        setError("Only CSV or Excel (.xlsx) files are allowed.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError(null);
      }
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
            {selectedFile ? selectedFile.name : "No file selected"}
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