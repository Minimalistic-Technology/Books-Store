// File: components/ProductForm.tsx
"use client";

import { useState } from "react";
import type { Product } from "../types";

type ProductFormProps = {
  product?: Product;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; price: number; inventory: number; description: string; createdAt?: string }) => void;
};

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: product?.id || "",
    name: product?.name || "",
    price: product?.price || 0,
    inventory: product?.inventory || 0,
    description: product?.description || "",
    createdAt: product?.createdAt || new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "inventory" ? parseFloat(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.inventory < 0) newErrors.inventory = "Inventory cannot be negative";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;
      if (product?.id) {
        response = await fetch(`http://localhost:5000/api/bookstore/productroutes/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: formData.name,
            price: formData.price,
            inventory: formData.inventory,
            description: formData.description,
            createdAt: formData.createdAt,
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/bookstore/productroutes/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: formData.name,
            price: formData.price,
            inventory: formData.inventory,
            description: formData.description,
            createdAt: formData.createdAt,
          }),
        });
      }
      if (!response.ok) throw new Error((await response.json()).message || "Failed to save product");
      const savedData = await response.json();
      onSave({
        id: savedData._id || product?.id,
        name: formData.name,
        price: formData.price,
        inventory: formData.inventory,
        description: formData.description,
        createdAt: formData.createdAt,
      });
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors((prev) => ({ ...prev, apiError: (error as Error).message }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                step="0.01"
                min="0.01"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <input
                type="number"
                name="inventory"
                value={formData.inventory || ""}
                onChange={handleChange}
                placeholder="Inventory"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                min="0"
              />
              {errors.inventory && <p className="text-red-500 text-sm mt-1">{errors.inventory}</p>}
            </div>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-y"
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Save
            </button>
          </div>
          {errors.apiError && <p className="text-red-500 text-sm mt-2">{errors.apiError}</p>}
        </form>
      </div>
    </div>
  );
}