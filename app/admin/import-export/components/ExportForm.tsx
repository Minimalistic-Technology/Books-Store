
"use client";

import { useState, useEffect } from "react";

import { API_BASE_URL } from '../../../../utils/api';
import {  Content, User } from "../../order-product-management/types";



type ExportFormProps = {
  onExport: (data: { type: "users" | "products"; format: "csv" | "excel" }) => void;
};

export default function ExportForm({ onExport }: ExportFormProps) {
  const [exportData, setExportData] = useState<{ type: "users" | "products"; format: "csv" | "excel" }>({ type: "users", format: "csv" });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`,{credentials:"include"});
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch  {
        
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const booksRes = await fetch(`${API_BASE_URL}/books`,{credentials:"include"});
        const books = await booksRes.json()
        
        setProducts(books);

      } catch  {
        
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExportData((prev) => ({
      ...prev,
      [name]: value as "users" | "products" | "csv" | "excel",
    }));
  };

  const handleExport = () => {
    onExport(exportData);
    if (exportData.type === "users" && users.length > 0) {
      let exportContent = "";
      const headers = ["Username", "Email"];
      if (exportData.format === "csv") {
        exportContent = [
          headers.join(","),
          ...users.map((user) =>
            [
              `"${user.username}"`,
              `"${user.email}"`,
            ].join(",")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportData.format === "excel") {
        exportContent = [
          headers.join("\t"),
          ...users.map((user) =>
            [
              user.username,
              user.email,
            ].join("\t")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/tab-separated-values;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.xls`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (exportData.type === "products" && products.length > 0) {
      let exportContent = "";
      const headers = [
        "Title",
        "Category",
        "Subcategory",
        "Tags",
        "Author",
        "Publisher",
        "Price",
        "Condition",
        "New Quantity",
        "Discount for New Books (%)",
        "Old Quantity",
        "Discount for Old Books (%)",
        "Valid Image Link",
        "Estimated Delivery",
        "Description",
        "SEO Title",
        "SEO Description",
      ];
      if (exportData.format === "csv") {
        exportContent = [
          headers.join(","),
          ...products.map((product) =>
            [
              `"${product.title}"`,
              `"${product.categoryPath.split("/")[0]}"`,
              `"${product.categoryPath.split("/")[1]}"`,
              `"${product.tags}"`,
              `"${product.author}"`,
              `"${product.publisher}"`,
              `"${product.price}"`,
              `"${product.condition}"`,
              `"${product.quantityNew}"`,
              `"${product.discountNew}"`,
              `"${product.quantityOld}"`,
              `"${product.discountOld}"`,
              `"${product.imageUrl}"`,
              `"${product.estimatedDelivery}"`,
              `"${product.description}"`,
              `"${product.seoTitle}"`,
              `"${product.seoDescription}"`,
            ].join(",")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `products_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportData.format === "excel") {
        exportContent = [
          headers.join("\t"),
          ...products.map((product) =>
            [
              product.title,
              product.categoryPath.split("/")[0],
              product.categoryPath.split("/")[1],
              product.tags,
              product.author,
              product.publisher,
              product.price,
              product.condition,
              product.quantityNew,
              product.discountNew,
              product.quantityOld,
              product.discountOld,
              product.imageUrl,
              product.estimatedDelivery,
              product.description,
              product.seoTitle,
              product.seoDescription,
            ].join("\t")
          ),
        ].join("\n");
        const blob = new Blob([exportContent], { type: "text/tab-separated-values;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `products_${new Date().toISOString().split("T")[0]}.xls`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Type</label>
        <select
          name="type"
          value={exportData.type}
          onChange={handleChange}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          onChange={handleChange}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
        </select>
      </div>
      <button
        onClick={handleExport}
        disabled={loading || (exportData.type === "users" && users.length === 0) || (exportData.type === "products" && products.length === 0)}
        className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Export Data"}
      </button>
    </div>
  );
}