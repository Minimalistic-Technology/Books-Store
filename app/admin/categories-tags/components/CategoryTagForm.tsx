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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="fixed inset-0 bg-[#fff3cd] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {item ? "Edit Category/Tag" : "Create Category/Tag"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name (e.g., Fiction, Review)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="SEO Title (e.g., Fiction Books 2025)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="SEO Description (e.g., Explore Fiction Books 2025)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-y"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}