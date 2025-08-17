"use client";

import { useState } from "react";
import ImportForm from "./components/ImportForm";
import ExportForm from "./components/ExportForm";
import { Content } from "../content-management/page";
import { User } from "./components/ExportForm";
import { API_BASE_URL } from '../../../utils/api';

export default function ImportExportManagement() {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleImport = async (
    data: { type: "users"; file: File | null; parsedData: User[] } | 
          { type: "products"; file: File | null; parsedData: Content[] }
  ) => {
    try {
      if (data.type === "users") {
        console.log("Importing users:", data.parsedData);
        setSuccessMessage("Users imported successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else if (data.type === "products") {
        const productsByCategory: { [key: string]: Content[] } = {};
        data.parsedData.forEach((product: Content) => {
          if (!productsByCategory[product.categoryName]) {
            productsByCategory[product.categoryName] = [];
          }
          productsByCategory[product.categoryName].push(product);
        });

        console.log("Products by category:", productsByCategory);

        const importPromises = Object.entries(productsByCategory).map(async ([category, products]) => {
          const validatedProducts = products.map((product: Content) => {
            const tagsArray = product.tags && product.tags.trim() 
              ? product.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
              : ["General"];
            
            if (!product.title || !product.categoryName || !product.subCategory || !tagsArray.length ||
                !product.price || !product.description || !product.estimatedDelivery ||
                !product.condition || !product.author || !product.publisher || !product.imageUrl) {
              throw new Error(`Invalid product data for "${product.title || 'unknown'}": Missing required fields`);
            }

            if (!["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(product.condition)) {
              throw new Error(`Invalid condition "${product.condition}" for "${product.title || 'unknown'}"`);
            }

            return {
              title: product.title,
              categoryName: product.categoryName,
              subCategory: product.subCategory,
              tags: tagsArray,
              author: product.author,
              publisher: product.publisher,
              price: product.price,
              condition: product.condition,
              quantityNew: product.quantityNew || 0,
              discountNew: product.discountNew || 0,
              quantityOld: product.quantityOld || 0,
              discountOld: product.discountOld || 0,
              imageUrl: product.imageUrl,
              estimatedDelivery: product.estimatedDelivery,
              description: product.description,
              seoTitle: product.seoTitle || product.title,
              seoDescription: product.seoDescription || product.description,
            };
          });

          const response = await fetch(
            `${API_BASE_URL}/book-categories/${encodeURIComponent(category)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ books: validatedProducts }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `Failed to import products for ${category}: ${errorData.errors?.map((e: any) => e.error).join("; ") || errorData.error || JSON.stringify(errorData)}`
            );
          }

          return response.json();
        });

        await Promise.all(importPromises);
        setSuccessMessage("Products imported successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err: any) {
      console.error("Import error:", err);
      setError(err.message || "Failed to import data");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleExport = (data: { type: string; format: string }) => {
    try {
      console.log("Exporting data:", data);
      setSuccessMessage(`Exporting ${data.type} in ${data.format} format`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to export data");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Import/Export Management</h1>

      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Data</h2>
          <ImportForm onImport={handleImport} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Data</h2>
          <ExportForm onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}