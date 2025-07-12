"use client";

import { useState, useEffect } from "react";
import ExportForm from "./components/ExportForm";
import ImportForm from "./components/ImportForm";
import { updateProducts } from "../order-product-management/page";
import { useDashboard } from "../dashboard/page";

// Define interfaces
export interface ExportData {
  type: "users" | "products";
  format: "csv" | "excel";
}

export interface ImportData {
  file: File | null;
  type: "users" | "products";
  parsedData: any[] | null;
}

export default function ImportExportManagement() {
  const [exportData, setExportData] = useState<ExportData>({ type: "users", format: "csv" });
  const [importData, setImportData] = useState<ImportData>({ file: null, type: "users", parsedData: null });
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const { setMetrics } = useDashboard();

  const handleExport = (data: ExportData) => {
    setExportData(data);
  };

  const handleImport = (data: ImportData) => {
    setImportData(data);
    if (data.file && data.parsedData) {
      setImportMessage("Importing data, please wait...");
      if (data.type === "products") {
        fetch("http://localhost:5000/api/bookstore/productroutes/products/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: data.parsedData }),
        })
          .then(response => response.json())
          .then(updatedProducts => {
            if (updatedProducts.success) {
              updateProducts(updatedProducts.products.map((p: any) => ({
                id: p._id,
                name: p.productName,
                price: p.price,
                inventory: p.inventory,
                description: p.description,
                createdAt: p.createdAt,
              })), (products) => {
                console.log("Products updated in state:", products);
              });
              setImportMessage("Products imported successfully!");
              setTimeout(() => setImportMessage(null), 3000);
            } else {
              setImportMessage(`Failed to import products: ${updatedProducts.message}`);
              setTimeout(() => setImportMessage(null), 3000);
            }
          })
          .catch(error => {
            console.error("Failed to import products:", error);
            setImportMessage("Error importing products.");
            setTimeout(() => setImportMessage(null), 3000);
          });
      } else if (data.type === "users") {
        fetch("http://localhost:5000/api/users/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ users: data.parsedData }),
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              setImportMessage("Users imported successfully!");
              fetch("http://localhost:5000/api/users")
                .then(res => res.json())
                .then(users => setMetrics(prev => ({ ...prev, userCount: users.length })))
                .catch(err => console.error("Failed to update user count:", err));
              setTimeout(() => setImportMessage(null), 3000);
            } else {
              setImportMessage(`Failed to import users: ${result.message || result.error?.message || 'Unknown error'}`);
              setTimeout(() => setImportMessage(null), 3000);
            }
          })
          .catch(error => {
            console.error("Failed to import users:", error);
            setImportMessage("Error importing users.");
            setTimeout(() => setImportMessage(null), 3000);
          });
      }
    }
  };

  return (
    <div className="space-y-8 p-4 animate__fadeInUp">
      <h1 className="text-4xl font-extrabold text-yellow-900">Import/Export - Books Store</h1>
      {importMessage && (
        <div className={`p-3 rounded-lg animate__fadeIn ${importMessage.includes("Failed") || importMessage.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {importMessage}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Export Data</h2>
          <ExportForm onExport={handleExport} />
        </div>
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Import Bulk Data</h2>
          <ImportForm onImport={handleImport} />
        </div>
      </div>
    </div>
  );
}