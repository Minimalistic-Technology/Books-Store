"use client";

import { useState, useRef } from "react";

type CategoryTagFormProps = {
  item?: {
    id?: string;
    name?: string;
    type?: "category" | "tag";
    seoTitle?: string;
    seoDescription?: string;
  };
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    type: "category" | "tag";
    seoTitle: string;
    seoDescription: string;
  }) => void;
};

export default function CategoryTagForm({ item, onClose, onSave }: CategoryTagFormProps) {
  const [formData, setFormData] = useState({
    id: item?.id || "",
    name: item?.name || "",
    type: item?.type || "category",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.seoTitle.trim()) newErrors.seoTitle = "SEO Title is required";
    if (!formData.seoDescription.trim()) newErrors.seoDescription = "SEO Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: formData.id,
      name: formData.name,
      type: formData.type as "category" | "tag",
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-yellow-500 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {item ? "Edit Category/Tag" : "Create Category/Tag"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name (e.g., Fiction, Review)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="category">Category</option>
                <option value="tag">Tag</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
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