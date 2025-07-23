"use client";

import { useState, useRef } from "react";
import { API_BASE_URL } from '../../../../utils/api';

type CategoryTagFormProps = {
  item?: {
    id?: string;
    name?: string;
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[]; 
  };
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    seoTitle: string;
    seoDescription: string;
  }) => void;
};

export default function CategoryTagForm({ item, onClose, onSave }: CategoryTagFormProps) {
  const [formData, setFormData] = useState({
    id: item?.id || "",
    name: item?.name || "",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    tags: item?.tags || [], 
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.seoTitle.trim()) newErrors.seoTitle = "SEO Title is required";
    if (!formData.seoDescription.trim()) newErrors.seoDescription = "SEO Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSave = {
      id: formData.id,
      name: formData.name,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      tags: formData.tags, 
    };

    try {
      let response;
      if (formData.id) {
        response = await fetch(`${API_BASE_URL}/book-categories/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/book-categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([dataToSave]), 
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }
      const savedData = await response.json();
      const savedCategory = Array.isArray(savedData) ? savedData[0] : savedData;
      onSave({
        id: savedCategory._id || formData.id || Date.now().toString(),
        name: formData.name,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      });
    } catch (error: any) {
      console.error("Error saving category:", error);
      setErrors({ general: error.message || "Failed to save category. Please try again." });
    }
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {item ? "Edit Category" : "Create Category"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name (e.g., Fiction)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="SEO Title (e.g., Fiction Books 2025)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.seoTitle && <p className="text-red-500 text-sm mt-1">{errors.seoTitle}</p>}
            </div>
            <div>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="SEO Description (e.g., Explore Fiction Books 2025)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-y"
                required
              />
              {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>}
            </div>
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
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
        </form>
      </div>
    </div>
  );
}